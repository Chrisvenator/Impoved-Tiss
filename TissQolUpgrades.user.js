// ==UserScript==
// @name         TISS QOL Upgrades
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Some qol improvements for TISS
// @author       Chrisvenator
// @match        *://tiss.tuwien.ac.at/*
// @match        *://tuwel.tuwien.ac.at/login/index.php
// @match        *idp.zid.tuwien.ac.at/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// ==/UserScript==


(function () {
    'use strict';

    const currentSemester = "2023W";
    const automaticLogin = true;

    const highlightCurrentStudium = true;
    const currentStudium = "Bachelorstudium Software & Information Engineering"

    const completedLVANames = ["Einführung in die Programmierung 1",
        "Grundzüge digitaler Systeme",
        "Denkweisen der Informatik",
        "Orientierung Informatik und Wirtschaftsinformatik",
        "Algebra und Diskrete Mathematik für Informatik und Wirtschaftsinformatik",
        "Analysis für Informatik und Wirtschaftsinformatik",
        "Algorithmen und Datenstrukturen",
        "Einführung in die Programmierung 2",
        "Einführung in Visual Computing",
        "Datenbanksysteme",
        "Statistik und Wahrscheinlichkeitstheorie",
        "Daten- und Informatikrecht",
        "Software Engineering",
        "Propädeutikum für Informatik",
        "Softskills für TechnikerInnen",
        "Einführung in die Programmierung 1",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ]


    window.addEventListener("load", function () {
        const currentUrl = window.location.href;


        if (currentUrl.includes("curriculumSemester")) {
            paintLVAs(completedLVANames, currentSemester);
            document.getElementById("j_id_2r:semesterSelect").addEventListener("change", function () {
                setTimeout(function () {
                    paintLVAs(completedLVANames, currentSemester)
                }, 2000);
            }); //event listener: change
        }


        //////
        //highlight current Studium
        //////

        if (highlightCurrentStudium && currentUrl.includes("tiss.tuwien.ac.at/curriculum/studyCodes")) {
            const links = document.querySelectorAll('a');

            for (const link of links) {
                if (link.innerText.includes(currentStudium)) {
                    // console.log(link.href.toString())
                    // console.log(link.href.toString().substring(0, link.toString().indexOf("&key=")));
                    const key = link.href.toString().substring(link.toString().indexOf("key="));
                    link.href = "https://tiss.tuwien.ac.at/curriculum/public/curriculumSemester.xhtml?semesterCode=" + currentSemester + "&le=false&semester=YEAR&" + key;
                    console.log("Found link:", link.href);

                    link.parentElement.style.backgroundColor = '#ceffc5';
                    break;
                }
            }
        }

        //////
        //Automatic login
        //////

        if (automaticLogin) {
            if (currentUrl.includes("tuwel.tuwien.ac.at/login/index.php")) {
                window.location.href = "https://tuwel.tuwien.ac.at/auth/saml2/login.php";
            } else if (currentUrl.includes("idp.zid.tuwien.ac.at/simplesaml/module.php/core/loginuserpass.php")) {
                console.log(document.getElementById("samlloginbutton"));
            } else if (currentUrl.includes("idp.zid.tuwien.ac.at/simplesaml/module.php/oldPW/confirmOldPW.php")) {
                document.getElementById("yesbutton").click();
            } else if (currentUrl === "https://tiss.tuwien.ac.at/") {
                document.getElementsByClassName("toolLogin")[0].click();
            }
        }
    }); //event listener: load

})

();

function paintLVAs(completedLVANames, currentSemester) {
    const semesterContainer = Array.from(document.getElementsByClassName("standard big"));
    semesterContainer.forEach(function (semester) {

        const row = Array.from(semester.children[1].children);
        row.forEach(function (element) {
            // console.log(element)
            // console.log(element.children[0])
            // console.log(element.children[0].children[0])
            // console.log(element.children[0].children[0].childNodes[0].hasChildNodes())

            if (element.children[0].children[0].childNodes[0].hasChildNodes() &&
                element.children[0].children[0].children[0].tagName === "SPAN") {

                var lvaNumber = element.children[0].children[0].children[0].children[0].innerHTML + "";
                var lvaName = element.children[0].children[0].children[0].children[1].innerText + "";

                if (!lvaNumber.includes(currentSemester)) {
                    console.log("pog")
                    element.children[0].children[0].style.setProperty("color", "#ff0000", "important");
                    element.children[0].children[0].style.setProperty("fontWeight", "bold", "important");
                }
                lvaNumber = lvaNumber.substring(0, lvaNumber.indexOf(" "));

                if (completedLVANames.includes(lvaName)) {

                    element.style.backgroundColor = "#F2FFF2"
                    element.children[0].children[0].style.setProperty("background-color", "#f2fff2", "important");
                }


            } else {
                let lvaName = element.children[0].children[0].innerText.toString()
                    .replace("VO ", "")
                    .replace("UE ", "")
                    .replace("VU ", "")
                    .trimEnd();

                if (completedLVANames.includes(lvaName)) {
                    element.style.backgroundColor = "#e2f1e2"
                    element.children[0].children[0].style.setProperty("background-color", "#e2f1e2", "important");
                } else {
                    element.style.backgroundColor = "#eeeeee"
                    element.children[0].children[0].style.setProperty("background-color", "#eeeeee", "important");
                }

            }
        });
    });
}