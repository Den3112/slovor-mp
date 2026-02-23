---
name: aif-fix
description: Automated troubleshooting and fixing of system inconsistencies, bugs, and configuration errors.
---

# 🏭 AI-Factory: Fix

This skill automates the process of diagnosing and fixing system issues, particularly those related to Windows Update, configuration drift, and environment inconsistencies.

## 🛠️ Usage

Activate this skill when you encounter persistent errors that standard troubleshooting steps haven't resolved.

## 📋 Steps

1. **Audit Registry**: Identify and remove all keys forcing incorrect OS versioning (e.g., `TargetReleaseVersion`, `ProductVersion`, `Insider` policies).
2. **Reset Services**: Stop and restart `wuauserv`, `bits`, `cryptsvc`, and `msiserver`.
3. **Purge Cache**: Clear `%windir%\SoftwareDistribution` and `%windir%\system32\catroot2`.
4. **Rescan**: Trigger a fresh update scan using `USOClient StartScan`.
5. **Verify**: Ensure the Windows Update UI reflects the correct OS version and targeting.

## ⚠️ Registry Targets

Remove values from:
- `HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate`
- `HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate`
- `HKLM:\SOFTWARE\Microsoft\WindowsSelfHost\Applicability`
- `HKLM:\SOFTWARE\Microsoft\WindowsSelfHost\UI\Selection`
