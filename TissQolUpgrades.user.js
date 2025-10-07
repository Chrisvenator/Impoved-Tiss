(function () {
    'use strict';

    const currentSemester = "2025W";
    const automaticLogin = true;

    const highlightCurrentStudium = true;
    const currentStudium = new Map([
        ["Masterstudium Data Science", "https://tiss.tuwien.ac.at/curriculum/public/curriculum.xhtml?key=67853"],
        ["Bachelorstudium Informatik", "https://tiss.tuwien.ac.at/curriculum/public/curriculum.xhtml?key=71647"],
        ["Bachelorstudium Software & Information Engineering", "https://tiss.tuwien.ac.at/curriculum/public/curriculum.xhtml?key=46100"]
    ]);

    const completedLVANames = [
        "Einführung in die Programmierung 1",
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
        "Programmierparadigmen",
        "Betriebssysteme",
        "Computerstatistik",
        "Generative AI",
        "EDV-Vertragsrecht",
        "Zwischen Karriere und Barriere",
        "Logikprogrammierung und Constraints",
        "Theoretische Informatik",
        "Interface und Interaction Design",
        "Web Engineering",
        "Audio and Video Production",
        "Daten- u. Informatikrecht, Übung",
        "Einführung in Artificial Intelligence",
        "Einführung in Security",
        "Wissenschaftliches Arbeiten",
        "Design und Fertigung",
        "Software-Qualitätssicherung",
        "Informationsvisualisierung",
        "Bachelorarbeit für Informatik und Wirtschaftsinformatik",
        "Projekt mit Bachelorarbeit",
        "Menschzentrierte Künstliche Intelligenz",
        "Logic and Reasoning in Computer Science",
        "Data-intensive Computing",
        "AKSTA Statistical Computing",
        "Knowledge Graphs",
        "",
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

        // Add Studium links on favorites page
        if (currentUrl.includes("tiss.tuwien.ac.at/education/favorites")) {
            addStudiumLinks();
        }

        // Paint completed LVAs in curriculum view
        if (currentUrl.includes("curriculumSemester")) {
            paintLVAs(completedLVANames, currentSemester);
            const semesterSelect = document.getElementById("j_id_2r:semesterSelect");
            if (semesterSelect) {
                semesterSelect.addEventListener("change", function () {
                    setTimeout(function () {
                        paintLVAs(completedLVANames, currentSemester);
                    }, 2000);
                });
            }
        }

        // Highlight current Studium on study codes page
        if (highlightCurrentStudium && currentUrl.includes("tiss.tuwien.ac.at/curriculum/studyCodes")) {
            const links = document.querySelectorAll('a');

            for (const [studiumName, studiumUrl] of currentStudium) {
                for (const link of links) {
                    if (link.innerText.includes(studiumName)) {
                        const key = link.href.toString().substring(link.toString().indexOf("key="));
                        link.href = "https://tiss.tuwien.ac.at/curriculum/public/curriculumSemester.xhtml?semesterCode=" + currentSemester + "&le=false&semester=YEAR&" + key;
                        console.log("Found link:", link.href);

                        link.parentElement.style.backgroundColor = '#ceffc5';
                        break;
                    }
                }
            }
        }

        // Automatic login functionality
        if (automaticLogin) {
            if (currentUrl.includes("tuwel.tuwien.ac.at/login/index.php")) {
                window.location.href = "https://tuwel.tuwien.ac.at/auth/saml2/login.php";
            } else if (currentUrl.includes("idp.zid.tuwien.ac.at/simplesaml/module.php/core/loginuserpass.php")) {
                setTimeout(pressEnterKey, 500);
            } else if (currentUrl.includes("idp.zid.tuwien.ac.at/simplesaml/module.php/oldPW/confirmOldPW.php")) {
                const yesButton = document.getElementById("yesbutton");
                if (yesButton) yesButton.click();
            } else if (currentUrl === "https://tiss.tuwien.ac.at/") {
                const loginButton = document.getElementsByClassName("toolLogin")[0];
                if (loginButton) loginButton.click();
            }
        }
    });

    function addStudiumLinks() {
        const searchForm = document.getElementById("searchForm");
        if (!searchForm) return;

        // Check if links already exist to avoid duplicates
        if (document.getElementById("studium-links-container")) return;

        const linksContainer = document.createElement("div");
        linksContainer.id = "studium-links-container";
        linksContainer.style.marginTop = "15px";
        linksContainer.style.marginBottom = "15px";
        linksContainer.style.padding = "12px 15px";
        linksContainer.style.backgroundColor = "#f5f5f5";
        linksContainer.style.borderRadius = "5px";
        linksContainer.style.border = "1px solid #ddd";

        const title = document.createElement("strong");
        title.textContent = "Meine Studiengänge: ";
        title.style.marginRight = "10px";
        title.style.color = "#333";
        linksContainer.appendChild(title);

        let isFirst = true;
        for (const [studiumName, studiumUrl] of currentStudium) {
            if (!isFirst) {
                const separator = document.createElement("span");
                separator.textContent = " | ";
                separator.style.margin = "0 8px";
                separator.style.color = "#999";
                linksContainer.appendChild(separator);
            }

            const link = document.createElement("a");
            // Construct the full URL with current semester
            link.href = studiumUrl + "&semesterCode=" + currentSemester + "&le=false&semester=YEAR";
            link.textContent = studiumName;
            link.style.color = "#005f9e";
            link.style.textDecoration = "none";
            link.style.fontWeight = "500";

            link.addEventListener("mouseenter", function () {
                this.style.textDecoration = "underline";
                this.style.color = "#003d6b";
            });
            link.addEventListener("mouseleave", function () {
                this.style.textDecoration = "none";
                this.style.color = "#005f9e";
            });

            linksContainer.appendChild(link);
            isFirst = false;
        }

        // Insert after the search form
        searchForm.parentNode.insertBefore(linksContainer, searchForm.nextSibling);
    }

    function pressEnterKey() {
        const enterKeyEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
            bubbles: true,
        });

        document.dispatchEvent(enterKeyEvent);
        console.log("Pressed Enter Key");
    }

    function paintLVAs(completedLVANames, currentSemester) {
        const semesterContainer = Array.from(document.getElementsByClassName("standard big"));
        semesterContainer.forEach(function (semester) {
            const tbody = semester.querySelector('tbody');
            if (!tbody) return;

            const rows = Array.from(tbody.children);
            rows.forEach(function (element) {
                // Skip footer rows
                if (element.classList.contains('ui-datatable-footer')) return;

                const firstCell = element.children[0];
                if (!firstCell) return;

                const linkContainer = firstCell.querySelector('a');
                if (!linkContainer) return;

                // Get LVA information
                const lvaTitle = linkContainer.textContent.trim();
                const graySpan = firstCell.querySelector('.gray');

                if (graySpan) {
                    const spanChildren = graySpan.querySelectorAll('span');
                    if (spanChildren.length >= 3) {
                        const lvaNumber = spanChildren[0].textContent.trim();
                        const lvaType = spanChildren[1].textContent.trim();
                        const lvaSemester = spanChildren[2].textContent.trim();

                        // Highlight if not from current semester
                        if (!lvaSemester.includes(currentSemester)) {
                            linkContainer.style.setProperty("color", "#ff0000", "important");
                            linkContainer.style.setProperty("fontWeight", "bold", "important");
                        }
                    }
                }

                // Check if LVA is completed
                if (completedLVANames.includes(lvaTitle)) {
                    element.style.backgroundColor = "#F2FFF2";
                    if (linkContainer.parentElement) {
                        linkContainer.parentElement.style.setProperty("background-color", "#f2fff2", "important");
                    }
                }
            });
        });
    }
})();