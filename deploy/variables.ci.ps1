# -----------------------------------------
# Variables script for CI deployment
# -----------------------------------------

# -----------------------------[Deployment credentials] ------------------------------------
$global:ENV_AzDeployAppId = $env:ENV_AzDeployAppId
$global:ENV_AzDeployAppCertificateValue = $env:ENV_AzDeployAppCertificateValue
$global:ENV_AzDeployTenantId = $env:ENV_AzDeployTenantId
$global:ENV_AzDeploySubcriptionId = $env:ENV_AzDeploySubcriptionId
$global:ENV_AzResourceGroupName = $env:ENV_AzResourceGroupName
$global:ENV_AzStorageAccountName = $env:ENV_AzStorageAccountName

$global:ENV_AzBlobContainerName = $env:ENV_AzBlobContainerName
$global:ENV_AzBlobContainerWebName = $env:ENV_AzBlobContainerWebName

# -----------------------------[TeamsFx] ------------------------------------
$global:ENV_MSSearchAppClientId = $env:ENV_MSSearchAppClientId
$global:ENV_MSSearchAppScopes = $env:ENV_MSSearchAppScopes

$global:ENV_M365AccountName = $env:ENV_M365AccountName
$global:ENV_M365AccountPassword = $env:ENV_M365AccountPassword
$global:ENV_M365TenantId = $env:ENV_M365TenantId

$global:ENV_EnvName = $env:ENV_EnvName


# Export variables as .env files so it can be consumed by other jobs
Write-Verbose "Exporting CI variables"

Get-Variable -Scope Global | Where-Object { $_.Name.StartsWith("ENV_") } | ForEach-Object {
    $name=  $_.Name
    $value = $_.Value
    Write-Verbose "Exporting $name"
    "$name=$value" >> $env:GITHUB_ENV
}