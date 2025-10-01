Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "schtasks /create /tn AutoShutdown /tr ""C:\workspace\shutdown.bat"" /sc once /st 18:00 /rl HIGHEST /f", 0, True
WshShell.Run "schtasks /create /tn windowlocks /tr ""rundll32.exe user32.dll,LockWorkStation"" /sc daily /st 11:40 /f", 0, True