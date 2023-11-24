# 
<#
.SYNOPSIS
    Deploys the PnP Modern Search Core components documentation

.DESCRIPTION
    Deploy all assets of Storybook static site

.NOTES
    Version:        1.0
    Author:         Franck Cornu - Microsoft 365 developer @Ubisoft Montréal
    Creation Date:  07/03/2023
    Purpose/Change: Initial script development

.EXAMPLE

    Deploy all:
    > deploy-docs.ps1 -Environment LOCAL

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

# > Upload static website folder to Azure blob container 
$storageAccount = Get-AzStorageAccount -ResourceGroupName $ENV_AzResourceGroupName | Select-Object -First 1
$ctx = $storageAccount.Context
Enable-AzStorageStaticWebsite -Context $ctx -IndexDocument "index.html"

$Properties = @{
    "ContentType" = "text/javascript"
} 

$storybookDistFolder = Join-Path -Path $PSScriptRoot -ChildPath "../packages/components/storybook-static/"
$mswJsFile = Get-ChildItem -Path (Join-Path -Path $PSScriptRoot -ChildPath "../packages/components/src/stories/public/mockServiceWorker.js")

# > Copy MSW service worker at root to enable mocks
Set-AzStorageBlobContent `
        -File $mswJsFile `
        -Container $ENV_AzBlobContainerWebName `
        -Blob $mswJsFile.Name`
        -Properties $Properties `
        -Context $storageAccount.Context `
        -Force

$files = Get-ChildItem -Path $storybookDistFolder -Recurse
$files | ForEach-Object {

    $file = $_
    Write-Verbose "Uploading $($_.Name) to '$ENV_AzBlobContainerWebName' blob container..."

    # Determine MIME type
    switch ($file.Extension) {
        '.svg' { $Properties.ContentType = "image/svg+xml" }
        '.json' { $Properties.ContentType = "application/json" }
        '.html' { $Properties.ContentType = "text/html" }
    }

    # Copy assets for this specific version
    Set-AzStorageBlobContent `
        -File $file `
        -Container $ENV_AzBlobContainerWebName `
        -Blob "$Version/$($file.FullName.Split("storybook-static$([IO.Path]::DirectorySeparatorChar)")[1])" `
        -Properties $Properties `
        -Context $storageAccount.Context `
        -Force

    Set-AzStorageBlobContent `
        -File $file `
        -Container $ENV_AzBlobContainerWebName `
        -Blob "latest/$($file.FullName.Split("storybook-static$([IO.Path]::DirectorySeparatorChar)")[1])" `
        -Properties $Properties `
        -Context $storageAccount.Context `
        -Force
}

$blob = Get-AzStorageBlob `
        -Container $ENV_AzBlobContainerWebName `
        -Context $storageAccount.Context

Write-Verbose "Successfully uploaded $($blob.Count) files."

if ($tmpCertPath ) {
    Remove-Item $tmpCertPath -Force
}