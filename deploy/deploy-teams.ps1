# 
<#
.SYNOPSIS
    Deploys the Teams Tab application

.DESCRIPTION
    Deploy all assets required for the Teams tab
.NOTES
    Version:        1.0
    Author:         Franck Cornu - Microsoft 365 developer @Ubisoft Montréal
    Creation Date:  10/01/2023
    Purpose/Change: Initial script development

.EXAMPLE

    Deploy all:
    > deploy-teams.ps1 -Environment LOCAL
#>

[CmdletBinding()]
Param (

    [Parameter(Mandatory = $True)]
    [ValidateNotNullOrEmpty()]
    [ValidateSet('LOCAL','CI')]
    [string]$Env,
    
    [Parameter(Mandatory = $False)]
    [string]$Version = "1.0.0"
)

$ErrorActionPreference = "Stop"

. $PSScriptRoot/scripts/Replace-Tokens.ps1

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

# More info about TeamsFx CI/CD deployment: 
# https://github.com/OfficeDev/TeamsFx/blob/main/docs/cicd_insider/others-script-cd-template.sh

$appFolderPath = Join-Path -Path $PSScriptRoot -ChildPath "..\apps\teams"

Write-Verbose "[TeamsFx] Set path to '$appFolderPath'..."
Push-Location $appFolderPath

# > Disable interactive mode to avoid user prompts
teamsfx config set interactive false

# https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/use-cicd-template#prepare-credentials
$env:CI_ENABLED= "true"

#  Account use to create the Teams app in https://dev.teams.microsoft.com. This account must have MFA disable and no particular licence nor permissions on anything. This account can be created on any tenant (even different form the tenant where bot is deployed)
$env:M365_TENANT_ID=$ENV_M365TenantId
$env:M365_ACCOUNT_NAME=$ENV_M365AccountName
$env:M365_ACCOUNT_PASSWORD=$ENV_M365AccountPassword

# Set variables for the HtmlWebpackPlugin
$env:ENV_MSSearchAppClientId = $ENV_MSSearchAppClientId
$env:ENV_MSSearchAppScopes = $ENV_MSSearchAppScopes

# > Connect to the Azure environment
Write-Verbose "[TeamsFx] Login to Azure with AppId $($ENV_AzDeployAppId)..."
teamsfx account login azure --service-principal --username $ENV_AzDeployAppId --password $ENV_AzDeployAppSecret --tenant $ENV_AzDeployTenantId

# > Generate TeamsFx .env file for that environment according to the loaded environment variables
$Tokens = @{}
(Get-Variable -Scope Global | Where-Object { $_.Name.StartsWith("ENV_") }) | ForEach-Object { $Tokens[$_.Name] = $_.Value } 

Replace-Tokens `
  -InputFile (Join-Path -Path $PSScriptRoot -ChildPath "..\apps\teams\env\.env.ci.template") `
  -OutputFile (Join-Path -Path $PSScriptRoot -ChildPath "..\apps\teams\env\.env.$ENV_EnvName") `
  -Tokens $Tokens `
  -StartTokenPattern "{{" `
  -EndTokenPattern "}}"

# > Update manifest version
if ($Version) {

    $ManifestTemplateFilePath = (Join-Path -Path $PSScriptRoot -ChildPath "..\apps\teams\appPackage\manifest.json")
    $ManifestFile = Get-Content $ManifestTemplateFilePath -Raw | ConvertFrom-Json
    $ManifestFile.version = $Version
    $ManifestFile | ConvertTo-Json -depth 32 | Set-Content $ManifestTemplateFilePath
}

# > Provision Azure resources
Write-Verbose "[TeamsFx] Provision Azure resources..."
teamsfx provision --env $ENV_EnvName --verbose

# > Deploy tab code in the web app
Write-Verbose "[TeamsFx] Deploy application..."
teamsfx deploy --env $ENV_EnvName

Pop-Location

if ($LASTEXITCODE) {
    throw "Error during TeamsFx deployment. Details $(Get-Error)"
}

