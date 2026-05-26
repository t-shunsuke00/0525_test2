$content = Get-Content -Path "c:\Users\user210069\Desktop\0525_1\math_problems.js" -Raw -Encoding UTF8
$evaluator = [System.Text.RegularExpressions.MatchEvaluator] {
    param($m)
    $inner = $m.Groups[1].Value
    $inner = $inner -replace '<', '&lt;' -replace '>', '&gt;'
    return '$' + $inner + '$'
}
$content = [System.Text.RegularExpressions.Regex]::Replace($content, '\$([^$]+)\$', $evaluator)
Set-Content -Path "c:\Users\user210069\Desktop\0525_1\math_problems.js" -Value $content -Encoding UTF8
Write-Host "Done"
