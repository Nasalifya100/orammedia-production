# Focused staging timing — individual routes, 5 samples each
$base = "https://orammedia-staging.nasalifya007.workers.dev"
$routes = @("/", "/projects", "/projects/inkondo", "/services", "/contact", "/admin/login")
$samples = 5

Write-Output "base=$base"
Write-Output "timestamp_utc=$((Get-Date).ToUniversalTime().ToString('o'))"
Write-Output "route,sample,http_code,dns_s,connect_s,tls_s,ttfb_s,total_s"

foreach ($r in $routes) {
  for ($i = 1; $i -le $samples; $i++) {
    $fmt = "%{http_code},%{time_namelookup},%{time_connect},%{time_appconnect},%{time_starttransfer},%{time_total}"
    $line = curl.exe -s -o NUL -w $fmt --max-time 120 "$base$r" 2>&1
    Write-Output "$r,$i,$line"
    Start-Sleep -Milliseconds 300
  }
}
