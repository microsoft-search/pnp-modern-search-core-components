# 
<#
.SYNOPSIS
    Deploys the PwC SA documentation

.DESCRIPTION
    Deploy all assets of Docusaurus static site

.NOTES
    Version:        1.0
    Author:         Franck Cornu - Microsoft 365 developer @PwC Montréal
    Creation Date:  17/10/2024
    Purpose/Change: Initial script development

.EXAMPLE

    Deploy all in from local machine:
    > deploy.ps1 -Env LOCAL

#>

[CmdletBinding()]
Param (

    [Parameter(Mandatory = $True)]
    [ValidateNotNullOrEmpty()]
    [ValidateSet('LOCAL','CI')]
    [string]$Env,

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
Import-Module Az.Websites
Import-Module Az.Accounts
Import-Module Az.Resources

Disable-AzContextAutosave

if ($Manual.IsPresent) {

    # Manual connection
    Connect-AzAccount -TenantId $ENV_AzDeployTenantId -Subscription $ENV_AzDeploySubcriptionId

} else {

    if ($ENV_AzDeployAppSecret) {

        [pscredential]$Credentials = New-Object System.Management.Automation.PSCredential($ENV_AzDeployAppId, (ConvertTo-SecureString $ENV_AzDeployAppSecret -AsPlainText -Force))

        Connect-AzAccount   -TenantId $ENV_AzDeployTenantId `
                            -Subscription $ENV_AzDeploySubcriptionId `
                            -Credential $Credentials `
                            -ServicePrincipal
    
    } else {
        throw "No valid credentials found for application connection."
    }
    
}

# > Publish to Azure App Service as ZIP deploy
$distFolderPath = Join-Path -Path $PSScriptRoot -ChildPath "../dist"

Compress-Archive -Path "$distFolderPath/*" -DestinationPath "$distFolderPath/app.zip" -Force
Publish-AzWebApp -ResourceGroupName $ENV_AzResourceGroupName -Name $ENV_AzWebAppName -ArchivePath "$distFolderPath/app.zip" -Force -Restart