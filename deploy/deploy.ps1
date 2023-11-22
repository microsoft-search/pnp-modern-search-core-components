# 
<#
.SYNOPSIS
    Deploys PnP Modern Search Core components

.DESCRIPTION
    Deploy all assets of the PnP Modern Search Core components

.NOTES
    Version:        1.0
    Author:         Franck Cornu - Microsoft 365 developer @Ubisoft Montréal
    Creation Date:  03/01/2023
    Purpose/Change: Initial script development

.EXAMPLE

    Deploy all:
    > Deploy.ps1 -Environment LOCAL

#>

[CmdletBinding()]
Param (

    [Parameter(Mandatory = $True)]
    [ValidateNotNullOrEmpty()]
    [ValidateSet('LOCAL','CI')]
    [string]$Env,

    [Parameter(Mandatory = $False)]
    [string]$Version = "0.0.0",

    [Parameter(Mandatory = $False)]
    [switch]$Manual
)

$ErrorActionPreference = "Stop"

Write-Verbose "`tInitializing variables..."

# Load correct variables according to the targeted environnement
switch ($Env) {
    'CI' {
        . $PSScriptRoot/variables.ci.ps1
        Write-Verbose "Variables from CI have been loaded..."
    }

    'LOCAL' {
        . $PSScriptRoot/variables.local.ps1
        Write-Verbose "Variables from local have been loaded..."
    }
}

#region ----------------------------------------------------------[Azure resources deployment]---------------------------------------------------------
Import-Module Az.Storage
Import-Module Az.Accounts
Import-Module Az.Resources

Disable-AzContextAutosave

if ($Manual.IsPresent) {

    # Manual connection
    Connect-AzAccount -TenantId $ENV_AzDeployTenantId -Subscription $ENV_AzDeploySubcriptionId

} else {

    $tmpCertPath = Join-Path -Path $PSScriptRoot -ChildPath "./tmp.pfx"

    $bytes = [Convert]::FromBase64String($ENV_AzDeployAppCertificateValue)
    [IO.File]::WriteAllBytes($tmpCertPath, $bytes)

    Connect-AzAccount   -TenantId $ENV_AzDeployTenantId `
                        -Subscription $ENV_AzDeploySubcriptionId `
                        -ApplicationId $ENV_AzDeployAppId `
                        -CertificatePath $tmpCertPath
}

# > Deploy the Azure Blob Storage
$templateTemplateFilePath = Join-Path -Path $PSScriptRoot -ChildPath "./main.bicep"

Write-Verbose "`tDeploying Azure infrastructure..."
New-AzResourceGroupDeployment `
    -ResourceGroupName $ENV_AzResourceGroupName `
    -TemplateFile $templateTemplateFilePath `
    -storageAccountName $ENV_AzStorageAccountName `
    -blobContainerName $ENV_AzBlobContainerName

# > Upload dist folder to Azure blob container 

Write-Verbose "Deploying version $Version..."

$storageAccount = Get-AzStorageAccount -ResourceGroupName $ENV_AzResourceGroupName | Select-Object -First 1

$distFolderPath = Join-Path -Path $PSScriptRoot -ChildPath "../packages/components/dist/"

$files = Get-ChildItem -Path $distFolderPath -Include "*.js","*.map","*.svg","*.json" -Recurse

$files | ForEach-Object {

    $file = $_
    Write-Verbose "Uploading $($_.Name) to '$ENV_AzBlobContainerName' blob container..."

    $Properties = @{
        "ContentType" = "text/javascript"
    } 

    # Determine MIME type
    switch ($file.Extension) {
        '.svg' { $Properties.ContentType = "image/svg+xml" }
        '.json' { $Properties.ContentType = "application/json" }
        '.html' { $Properties.ContentType = "text/html" }
        Default { 
            $Properties.Add("ContentEncoding","gzip")
            $Properties.Add("CacheControl","max-age=864000, public, must-revalidate")
        }
    }

    # Copy assets for this specific version
    Set-AzStorageBlobContent `
        -File $file `
        -Container $ENV_AzBlobContainerName `
        -Blob "$Version/$($file.FullName.Split("dist$([IO.Path]::DirectorySeparatorChar)")[1])" `
        -Properties $Properties `
        -Context $storageAccount.Context `
        -Force

    # Copy assets as the latest available version
    Set-AzStorageBlobContent `
        -File $file `
        -Container $ENV_AzBlobContainerName `
        -Blob "latest/$($file.FullName.Split("dist$([IO.Path]::DirectorySeparatorChar)")[1])" `
        -Properties $Properties `
        -Context $storageAccount.Context `
        -Force
}

$blob = Get-AzStorageBlob `
        -Container $ENV_AzBlobContainerName `
        -Context $storageAccount.Context

Write-Verbose "Successfully uploaded $($blob.Count) files."

if ($tmpCertPath ) {
    Remove-Item $tmpCertPath -Force
}