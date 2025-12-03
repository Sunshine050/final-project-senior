# PowerShell script to create a test user for login

$baseUrl = "http://localhost:3000"

Write-Host "Creating test user (Dispatcher)..." -ForegroundColor Cyan
Write-Host ""

$body = @{
    email = "dispatcher@example.com"
    password = "password123"
    firstName = "สมชาย"
    lastName = "เจ้าหน้าที่"
    role = "dispatcher"
    phone = "+66812345678"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "✅ User created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now login with:" -ForegroundColor Yellow
    Write-Host "   Email: dispatcher@example.com"
    Write-Host "   Password: password123"
    Write-Host ""
    Write-Host "Access Token:" -ForegroundColor Cyan
    Write-Host $response.accessToken
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

