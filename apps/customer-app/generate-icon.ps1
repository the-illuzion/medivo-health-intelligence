Add-Type -AssemblyName System.Drawing

function Create-MedivoIcon {
    param(
        [string]$outputPath,
        [int]$width,
        [int]$height
    )

    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    # Background fill (#0D1F1C)
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#0D1F1C'))
    $g.FillRectangle($bgBrush, 0, 0, $width, $height)

    # Scale factor based on 280x280 design
    $scaleX = $width / 280.0
    $scaleY = $height / 280.0

    # Gradient Brush (#46D9A2 to #0E9E86)
    $rect = New-Object System.Drawing.RectangleF(0, 0, $width, $height)
    $c1 = [System.Drawing.ColorTranslator]::FromHtml('#46D9A2')
    $c2 = [System.Drawing.ColorTranslator]::FromHtml('#0E9E86')
    $gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)

    # Main Drop Path
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddBezier((140 * $scaleX), (42 * $scaleY), (190 * $scaleX), (103 * $scaleY), (221 * $scaleX), (147 * $scaleY), (221 * $scaleX), (181 * $scaleY))
    $path.AddArc((59 * $scaleX), (100 * $scaleY), (162 * $scaleX), (162 * $scaleY), 0, 180)
    $path.AddBezier((59 * $scaleX), (181 * $scaleY), (59 * $scaleX), (147 * $scaleY), (90 * $scaleX), (103 * $scaleY), (140 * $scaleX), (42 * $scaleY))
    
    $g.FillPath($gradBrush, $path)

    # Center Cross (#123A34)
    $crossBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#123A34'))
    
    # Vertical Bar
    $vRect = New-Object System.Drawing.RectangleF((131 * $scaleX), (130 * $scaleY), (18 * $scaleX), (60 * $scaleY))
    $g.FillRectangle($crossBrush, $vRect)
    
    # Horizontal Bar
    $hRect = New-Object System.Drawing.RectangleF((110 * $scaleX), (151 * $scaleY), (60 * $scaleX), (18 * $scaleY))
    $g.FillRectangle($crossBrush, $hRect)

    # Save PNG
    $dir = [System.IO.Path]::GetDirectoryName($outputPath)
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated icon: $outputPath ($width x $height)"
}

$base = $PSScriptRoot

Create-MedivoIcon "$base\assets\icon.png" 1024 1024
Create-MedivoIcon "$base\assets\adaptive-icon.png" 1024 1024
Create-MedivoIcon "$base\android\app\src\main\res\mipmap-mdpi\ic_launcher.png" 48 48
Create-MedivoIcon "$base\android\app\src\main\res\mipmap-hdpi\ic_launcher.png" 72 72
Create-MedivoIcon "$base\android\app\src\main\res\mipmap-xhdpi\ic_launcher.png" 96 96
Create-MedivoIcon "$base\android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png" 144 144
Create-MedivoIcon "$base\android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" 192 192

Create-MedivoIcon "$base\android\app\src\main\res\mipmap-mdpi\ic_launcher_round.png" 48 48
Create-MedivoIcon "$base\android\app\src\main\res\mipmap-hdpi\ic_launcher_round.png" 72 72
Create-MedivoIcon "$base\android\app\src\main\res\mipmap-xhdpi\ic_launcher_round.png" 96 96
Create-MedivoIcon "$base\android\app\src\main\res\mipmap-xxhdpi\ic_launcher_round.png" 144 144
Create-MedivoIcon "$base\android\app\src\main\res\mipmap-xxxhdpi\ic_launcher_round.png" 192 192
