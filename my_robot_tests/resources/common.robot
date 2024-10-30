*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}     https://example.com

*** Keywords ***
Open Example Website
    Open Browser    ${URL}    chrome
    Title Should Be    Example Domain
    [Teardown]    Close Browser
