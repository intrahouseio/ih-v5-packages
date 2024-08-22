
!define SLUG "${NAME} v${VERSION}"
;--------------------------------
; Includes
Var CheckboxState
Var hCheckbox

!include "MUI2.nsh"
!include "logiclib.nsh"
!include "FileFunc.nsh"
;--------------------------------
; General
Name "${NAME}"
OutFile "setup.exe"
InstallDir "$PROGRAMFILES64\${SERVICE_NAME}"
RequestExecutionLevel admin
;--------------------------------
; UI  
!define MUI_HEADERIMAGE
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "${SLUG} Setup"

;--------------------------------
; Pages

; Installer pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "app\license.txt"
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_WELCOME
UninstPage custom un.preConfirm un.preConfirmLeave
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Set UI language
!insertmacro MUI_LANGUAGE "Russian"
;--------------------------------

!define StrRep "!insertmacro StrRep"
!macro StrRep output string old new
  Push `${string}`
  Push `${old}`
  Push `${new}`
  !ifdef __UNINSTALL__
      Call un.StrRep
  !else
      Call StrRep
  !endif
  Pop ${output}
!macroend

!macro Func_StrRep un
  Function ${un}StrRep
      Exch $R2 ;new
      Exch 1
      Exch $R1 ;old
      Exch 2
      Exch $R0 ;string
      Push $R3
      Push $R4
      Push $R5
      Push $R6
      Push $R7
      Push $R8
      Push $R9

      StrCpy $R3 0
      StrLen $R4 $R1
      StrLen $R6 $R0
      StrLen $R9 $R2
      loop:
          StrCpy $R5 $R0 $R4 $R3
          StrCmp $R5 $R1 found
          StrCmp $R3 $R6 done
          IntOp $R3 $R3 + 1 ;move offset by 1 to check the next character
          Goto loop
      found:
          StrCpy $R5 $R0 $R3
          IntOp $R8 $R3 + $R4
          StrCpy $R7 $R0 "" $R8
          StrCpy $R0 $R5$R2$R7
          StrLen $R6 $R0
          IntOp $R3 $R3 + $R9 ;move offset by length of the replacement string
          Goto loop
      done:

      Pop $R9
      Pop $R8
      Pop $R7
      Pop $R6
      Pop $R5
      Pop $R4
      Pop $R3
      Push $R0
      Push $R1
      Pop $R0
      Pop $R1
      Pop $R0
      Pop $R2
      Exch $R1
  FunctionEnd
!macroend
!insertmacro Func_StrRep ""
!insertmacro Func_StrRep "un."

;--------------------------------
; Section - Install App
Section "-hidden app"
  DetailPrint "Stop service"

  SimpleSC::StopService "${SERVICE_NAME}" 1 15
  Pop $0 

  DetailPrint "Copy files"

  SectionIn RO
  
  SetOutPath "$INSTDIR"
  File /r "app\*.*" 

  StrCpy $0 $WINDIR 1
  CreateDirectory "$0:\ProgramData\${SERVICE_NAME}"
 
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ${If} ${FileExists} "$INSTDIR\daemon\${APPFILE}.xml"
   
  ${Else}
    FileOpen $9 "$INSTDIR\daemon\${APPFILE}.xml" w
    FileWrite $9 "<service><id>${APPFILE}</id><name>${SERVICE_NAME}</name><description>${DESCRIPTION}</description><executable>$INSTDIR\${APPFILE}.exe</executable><workingdirectory>$INSTDIR</workingdirectory><logmode>none</logmode><stoptimeout>15sec</stoptimeout></service>"
    FileClose $9
  ${EndIf}

  ${If} ${FileExists} "$INSTDIR\config.json"
   
  ${Else}
    StrCpy $0 $WINDIR 1
    ${StrRep} '$1' '{"lang":"ru", "port":${PORT}, "vardir":"$0:\ProgramData\${SERVICE_NAME}", "assets":"$PROGRAMFILES64\${SERVICE_NAME}\assets", "log":"$PROGRAMFILES64\${SERVICE_NAME}\log", "temp":"$PROGRAMFILES64\${SERVICE_NAME}\temp", "zip":"$PROGRAMFILES64\${SERVICE_NAME}\tools\7z.exe", "unzip":"$PROGRAMFILES64\${SERVICE_NAME}\tools\7z.exe"}' '\' '\\'
    FileOpen $9 "$INSTDIR\config.json" w
    FileWrite $9 "$1"
    FileClose $9
  ${EndIf}

  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SERVICE_NAME}" "DisplayName" "${NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SERVICE_NAME}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SERVICE_NAME}" "Publisher" "${PUBLISHER}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SERVICE_NAME}" "DisplayIcon" "$INSTDIR\logo.ico"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SERVICE_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"

  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SERVICE_NAME}" "EstimatedSize" "$0"

  DetailPrint "Install service"

  SimpleSC::InstallService "${SERVICE_NAME}" "${NAME}" "16" "2" "$INSTDIR\daemon\${APPFILE}.exe" "" "" ""
  Pop $0 
  
  ; Set the description of a service
  SimpleSC::SetServiceDescription "${SERVICE_NAME}" "${DESCRIPTION}"
  Pop $0

  SimpleSC::SetServiceFailure "${SERVICE_NAME}" "0" "" "" "1" "0" "1" "0" "1" "0" 
  Pop $0
  
  DetailPrint "Start a service"

  #Start a service. Be sure to pass the service name, not the display name.
    SimpleSC::StartService "${SERVICE_NAME}" "" 30
    Pop $0

  DetailPrint "Done"
SectionEnd

;--------------------------------
; Section - Shortcut
Section "Desktop Shortcut" DeskShort
  WriteIniStr "$DESKTOP\${NAME}.url" "InternetShortcut" "URL" "http://localhost:${PORT}"
  WriteINIStr "$DESKTOP\${NAME}.url" "InternetShortcut" "IconFile" "$INSTDIR\logo.ico"
  WriteINIStr "$DESKTOP\${NAME}.url" "InternetShortcut" "IconIndex" "0"
SectionEnd

;--------------------------------
; Descriptions

;Language strings
LangString DESC_DeskShort ${LANG_RUSSIAN} "Создать ярлык на рабочем столе."

;Assign language strings to sections
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
!insertmacro MUI_DESCRIPTION_TEXT ${DeskShort} $(DESC_DeskShort)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

;--------------------------------
; Remove empty parent directories
Function un.RMDirUP
  !define RMDirUP '!insertmacro RMDirUPCall'

  !macro RMDirUPCall _PATH
        push '${_PATH}'
        Call un.RMDirUP
  !macroend

  ; $0 - current folder
  ClearErrors

  Exch $0
  ;DetailPrint "ASDF - $0\.."
  RMDir "$0\.."

  IfErrors Skip
  ${RMDirUP} "$0\.."
  Skip:

  Pop $0

FunctionEnd

;--------------------------------
; Section - Uninstaller

Function un.preConfirm
nsDialogs::Create 1018nsDialogs::Create 1018
Pop $0

${NSD_CreateLabel} 0 0 100% 12u "$(MyLabelText)"
Pop $0

${NSD_CreateCheckbox} 0 30u 100% 10u "Delete user personal data and files"
Pop $hCheckbox
${NSD_SetState} $hCheckbox $CheckboxState

nsDialogs::Show
FunctionEnd

Function un.preConfirmLeave
${NSD_GetState} $hCheckbox $CheckboxState
FunctionEnd

Section "Uninstall"
DetailPrint "Stop service"

SimpleSC::StopService "${SERVICE_NAME}" 1 15
Pop $0 

DetailPrint "Remove service"

SimpleSC::RemoveService "${SERVICE_NAME}"
Pop $0

DetailPrint "Remove files"

Delete "$DESKTOP\${NAME}.url"
Delete "$INSTDIR\Uninstall.exe"

RMDir /r "$INSTDIR"
${RMDirUP} "$INSTDIR"

${If} $CheckboxState == 1
  StrCpy $0 $WINDIR 1
  RMDir /r "$0:\ProgramData\${SERVICE_NAME}"
${Else}

${EndIf}

DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SERVICE_NAME}"
SectionEnd