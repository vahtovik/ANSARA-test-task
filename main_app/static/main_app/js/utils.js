addEventListener("DOMContentLoaded", () => {
    /* POPUP SECTION STARTS */
    const popupLinks = document.querySelectorAll(".popup-link");
    const body = document.querySelector("body");

    let unlock = 800;

    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                const popupName = popupLink
                    .getAttribute("href")
                    .replace("#", "");
                const currPopup = document.getElementById(popupName);

                if (this.hasAttribute("data-item-id")) {
                    const itemId = this.getAttribute("data-item-id");
                    const hiddenInput =
                        currPopup.querySelector("[name='taskId']");
                    hiddenInput.value = itemId;
                    hiddenInput.dispatchEvent(new Event("change"));
                }

                popupOpen(currPopup);
            });
        }
    }

    const popupCloseIcon = document.querySelectorAll(".close-popup");
    if (popupCloseIcon.length > 0) {
        for (let index = 0; index < popupCloseIcon.length; index++) {
            const el = popupCloseIcon[index];
            el.addEventListener("click", function (e) {
                e.preventDefault();
                popupClose(el.closest(".popup"));
            });
        }
    }

    function popupOpen(currentPopup) {
        if (currentPopup && unlock) {
            const popupActive = document.querySelector(".popup.open");
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                //	bodyBlock() убрать скрол сдвиг. Добавлю если нужно
            }
            currentPopup.classList.add("open");
            currentPopup.addEventListener("click", function (e) {
                if (!e.target.closest(".popup__content")) {
                    popupClose(e.target.closest(".popup"));
                }
            });
        }
    }

    function popupClose(popupActive, doUnlock = true) {
        popupActive.classList.remove("open");
        const hiddenInput = popupActive.querySelector("[name='taskId']");
        hiddenInput.value = "";
        hiddenInput.dispatchEvent(new Event("change"));
        const inputs = popupActive.querySelectorAll("input");
        if (inputs.length) {
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].value = "";
            }
        }
        if (doUnlock) {
            // bodyUnlock()
        }
    }

    /* Sortable SECTION STARTS */
    const containerSelector = "ul.sortable__list";
    const sortableElementsSelector = "ul.sortable__list > li.waiting-task";
    const sortbaleContainer = document.getElementById(
        "upper__tasks__block__list"
    );
    const sortable = new Sortable(sortbaleContainer, {
        draggable: sortableElementsSelector,
        onEnd: function () {
            console.log("drag:stop");

            document
                .querySelectorAll(".sortable-mirror")
                .forEach((e) => e.remove());

            const waitTasksContainer = document.getElementById(
                "upper__tasks__block__list"
            );
            const waitTasks =
                waitTasksContainer.querySelectorAll(".waiting-task");

            let idList = [];

            for (let index = 0; index < waitTasks.length; index++) {
                const task = waitTasks[index];
                // if (!task.classList.contains('draggable--over') && !task.classList.contains('draggable-mirror')) {
                let link = task.querySelector(".list__item__link");
                const attrId = link.getAttribute("data-item-id");
                idList.push({ id: attrId, orderNum: index + 1 });
                // }
            }

            const requestBody = JSON.stringify({ idList });

            fetch("/change-pending-tasks-order/", {
                method: "POST",
                body: requestBody,
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("it works");
                });
        },
    });

    /* Sortable SECTION STARTS */

    /* WATCHER SECTION STARTS */
    const watchElem = document.getElementById("upper__tasks__block__list");

    function hasActiveTask() {
        const liElements = watchElem.querySelectorAll(".list__item");

        for (const li of liElements) {
            if (li.classList.contains("active__task")) {
                if (watchElem.classList.contains("enable-hover")) {
                    watchElem.classList.remove("enable-hover");
                    return;
                }
                return;
            }
        }

        if (!watchElem.classList.contains("enable-hover")) {
            watchElem.classList.add("enable-hover");
        }

        return;
    }

    // Initial call
    hasActiveTask();

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(hasActiveTask);

    // Start observing the target node for configured mutations
    observer.observe(watchElem, { childList: true, subtree: true });
    /* WATCHER SECTION STARTS */

    /* TIMER SECTION STARTS */
    function startTimer(timerDiv) {
        setInterval(function () {
            incrementTimer(timerDiv);
        }, 1000);
    }

    function incrementTimer(timerDiv) {
        let timeParts = timerDiv.textContent.split(":");
        let minutes = parseInt(timeParts[0]);
        let seconds = parseInt(timeParts[1]);

        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;

            let activeTask = document.querySelector(".active__task");
            let innerDiv = activeTask.querySelector(".list__item__strend");
            let innerDivTextContent = activeTask.querySelector(
                ".list__item__strend"
            ).textContent;
            let splittedTime = innerDivTextContent.split("-");
            let startTime = splittedTime[0].trim();
            let endTime = splittedTime[1].trim();

            let endTimeParts = endTime.split(":");
            let endHours = parseInt(endTimeParts[0]);
            let endMinutes = parseInt(endTimeParts[1]);

            endMinutes++;
            if (endMinutes >= 60) {
                endHours++;
                endMinutes = 0;
            }

            let endTimeFinal =
                (endHours < 10 ? "0" + endHours : endHours) +
                ":" +
                (endMinutes < 10 ? "0" + endMinutes : endMinutes);
            innerDiv.textContent = `${startTime} - ${endTimeFinal}`;
        }

        timerDiv.textContent =
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds);
    }

    let activeTask = document.querySelector(".active__task");

    if (activeTask) {
        let timerDiv = activeTask.querySelector(".list__item__sepndtime p");
        startTimer(timerDiv);
    }
    /* TIMER SECTION ENDS */

    /* ONLY TODAY SECTION STARTS */
    const onlyTodayBtn = document.querySelector(".today-only");
    onlyTodayBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const taskBlocks = document.querySelectorAll(".tasks__block");
        if (taskBlocks.length > 2) {
            for (let i = 2; i < taskBlocks.length; i++) {
                taskBlocks[i].remove();
            }
        }
    });

    const tasks = document.querySelector(".tasks");
    const config = { childList: true, subtree: true };

    function onlyTodayClassChange() {
        const taskBlocks = document.querySelectorAll(".tasks__block");
        if (taskBlocks.length > 2) {
            console.log("More than two elements detected!");
            // Add class to the target element
            // For example:
            onlyTodayBtn.classList.remove("display-none");
        } else {
            // Remove class if there are two or fewer elements
            onlyTodayBtn.classList.add("display-none");
        }
    }

    onlyTodayClassChange();

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                onlyTodayClassChange();
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer1 = new MutationObserver(callback);

    // Start observing the parent node for configured mutations
    observer1.observe(tasks, config);

    /* ONLY TODAY SECTION ENDS */

    /* INPUT VALIDATION SECTION STARTS */
    const timeRangeBlocks = document.querySelectorAll(".popup__form-range"); //input[name="task_start"]
    // const endTimeInput = document.querySelector('.popup__form-range__inputs input[type="text"]:last-of-type');
    // const timeDifferenceDiv = document.querySelector('.popup__form-range__time');

    let startTimeInput, endTimeInput, timeDifferenceDiv;

    // Function to calculate time difference and update the display
    function calculateTimeDifference(e) {
        let startTimeInput, endTimeInput;
        if (e.target.getAttribute("name") == "task__start") {
            startTimeInput = e.target;
            endTimeInput = e.target.nextElementSibling.nextElementSibling;
        } else {
            startTimeInput =
                e.target.previousElementSibling.previousElementSibling;
            endTimeInput = e.target;
        }
        let timeDifferenceDiv = e.target.parentNode.nextElementSibling;
        const startTime = parseTime(startTimeInput.value);
        const endTime = parseTime(endTimeInput.value);
        // Function to parse time from input value (assuming format is HH:MM)
        function parseTime(timeString) {
            const parts = timeString.split(":");
            if (parts.length !== 2) return null;
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            if (isNaN(hours) || isNaN(minutes)) return null;
            return { hours, minutes };
        }

        // Function to calculate time difference in minutes
        function calculateDifference(startTime, endTime) {
            const startMinutes = startTime.hours * 60 + startTime.minutes;
            const endMinutes = endTime.hours * 60 + endTime.minutes;
            return endMinutes - startMinutes;
        }

        // Function to format time difference into 'HHч MMм' format
        function formatTimeDifference(timeDifference) {
            const hours = Math.floor(timeDifference / 60);
            const minutes = timeDifference % 60;

            if (minutes + hours * 60 < 60) {
                return `${minutes} м`;
            }

            return `${hours} ч ${minutes} м`;
        }

        const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (
            (timeFormat.test(startTimeInput.value) &&
                timeFormat.test(endTimeInput.value)) === false
        ) {
            timeDifferenceDiv.textContent = "";
            return;
        }

        if (!startTime || !endTime) {
            timeDifferenceDiv.textContent = "";
            return;
        }

        if (endTime < startTime) {
            timeDifferenceDiv.textContent = "";
            //timeDifferenceDiv.textContent = 'End time should be greater than start time';
            return;
        }
        const timeDifference = calculateDifference(startTime, endTime);
        timeDifferenceDiv.textContent = formatTimeDifference(timeDifference);
    }

    for (const block of timeRangeBlocks) {
        startTimeInput = block.querySelector('input[name="task__start"]');
        endTimeInput = block.querySelector('input[name="task__end"]');
        timeDifferenceDiv = block.querySelector(".popup__form-range__time");
        if (startTimeInput && endTimeInput && timeDifferenceDiv) {
            startTimeInput.addEventListener("input", calculateTimeDifference);
            endTimeInput.addEventListener("input", calculateTimeDifference);
        }
    }

    //calculateTimeDifference();

    /* INPUT VALIDATION SECTION ENDS */

    /* PUT ALL OF THE DATA TO POPUP STARTS */
    const hiddenInputs = document.querySelectorAll("[name='taskId']");
    function getPopupData(e) {
        const taskId = e.target.value;
        const popup = this.closest(".popup");
        const popupInputTaskName = popup.querySelector(".task__name");
        const popupInputTaskStart = popup.querySelector("[name='task__start']");
        const popupInputTaskEnd = popup.querySelector("[name='task__end']");
        const popupDay = popup.querySelector(".popup__form-day p");

        /* VSE LI POPUPS S TAKIM CLASSOM ??????? KAJETSYA DA */
        const allLinks = document.querySelectorAll(".popup-link");
        let targetLink;
        for (const link of allLinks) {
            if (
                link.hasAttribute("data-item-id") &&
                link.getAttribute("data-item-id") == taskId
            ) {
                targetLink = link;
            }
        }

        if (!targetLink) {
            console.log(
                "hidden value was change not by pressing on a.popup-link. It is impossible!"
            );
            return;
        }

        const targetLinkTaskName =
            targetLink.querySelector(".list__item__title");
        const targetLinkStrend = targetLink.querySelector(
            ".list__item__strend"
        );
        const targetLinkStr = targetLinkStrend
            ? targetLinkStrend.textContent
                ? targetLinkStrend.textContent.split("-")[0].trim()
                : 0
            : 0;
        const targetLinkEnd = targetLinkStrend
            ? targetLinkStrend.textContent
                ? targetLinkStrend.textContent.split("-")[1].trim()
                : 0
            : 0;
        // const infoTitle = targetLink.closest('.tasks__block__list').previousElementSibling ? targetLink.closest('.tasks__block__list').previousElementSibling.querySelector('.tasks__block__info__title h2') : 0
        console.log("111111");

        if (popupInputTaskName && targetLinkTaskName) {
            popupInputTaskName.value = targetLinkTaskName.textContent;
        }

        if (
            popupInputTaskStart &&
            targetLinkStrend &&
            targetLinkStrend.textContent !== ""
        ) {
            popupInputTaskStart.value = targetLinkStr;
        }

        if (
            popupInputTaskEnd &&
            targetLinkStrend &&
            targetLinkStrend.textContent !== ""
        ) {
            popupInputTaskEnd.value = targetLinkEnd;
        }

        // if (infoTitle && popupDay) {
        //     popupDay.textContent = infoTitle.textContent.toLocaleLowerCase().trim()
        // }
    }
    for (const hiddenInput of hiddenInputs) {
        hiddenInput.addEventListener("change", getPopupData);
    }
    /* PUT ALL OF THE DATA TO POPUP ENDS */
});

function popupOpen(currentPopup) {
    if (currentPopup) {
        const popupActive = document.querySelector(".popup.open");
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            //	bodyBlock() убрать скрол сдвиг. Добавлю если нужно
        }
        currentPopup.classList.add("open");
        currentPopup.addEventListener("click", function (e) {
            if (!e.target.closest(".popup__content")) {
                popupClose(e.target.closest(".popup"));
            }
        });
    }
}

function popupClose(popupActive, doUnlock = true) {
    popupActive.classList.remove("open");
    // const hiddenInput = popupActive.querySelector("[name='taskId']")
    // hiddenInput.value = ""
    const inputs = popupActive.querySelectorAll("input");
    if (inputs.length) {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
    }
    if (doUnlock) {
        // bodyUnlock()
    }
}

function bindTaskWithPopup(e) {
    e.preventDefault();
    const popupName = this.getAttribute("href").replace("#", "");
    const currPopup = document.getElementById(popupName);

    if (this.hasAttribute("data-item-id")) {
        const itemId = this.getAttribute("data-item-id");
        const hiddenInput = currPopup.querySelector("[name='taskId']");
        hiddenInput.value = itemId;
        hiddenInput.dispatchEvent(new Event("change"));
    }
    popupOpen(currPopup);
}

function formatDuration(duration) {
    let hours = Math.floor(duration / 60);
    let minutes = duration % 60;

    if (minutes + hours * 60 < 60) {
        return `${minutes} м`;
    }

    return `${hours} ч ${minutes} м`;
}

function startTimer(timerDiv) {
    setInterval(function () {
        incrementTimer(timerDiv);
    }, 1000);
}

function incrementTimer(timerDiv) {
    let timeParts = timerDiv.textContent.split(":");
    let minutes = parseInt(timeParts[0]);
    let seconds = parseInt(timeParts[1]);

    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;

        let activeTask = document.querySelector(".active__task");
        let innerDiv = activeTask.querySelector(".list__item__strend");
        let innerDivTextContent = activeTask.querySelector(
            ".list__item__strend"
        ).textContent;
        let splittedTime = innerDivTextContent.split("-");
        let startTime = splittedTime[0].trim();
        let endTime = splittedTime[1].trim();

        let endTimeParts = endTime.split(":");
        let endHours = parseInt(endTimeParts[0]);
        let endMinutes = parseInt(endTimeParts[1]);

        endMinutes++;
        if (endMinutes >= 60) {
            endHours++;
            endMinutes = 0;
        }

        let endTimeFinal =
            (endHours < 10 ? "0" + endHours : endHours) +
            ":" +
            (endMinutes < 10 ? "0" + endMinutes : endMinutes);
        innerDiv.textContent = `${startTime} - ${endTimeFinal}`;
    }

    timerDiv.textContent =
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);
}

function getMinuteDifference(startTime, endTime) {
    var diffMs = endTime.getTime() - startTime.getTime();
    return Math.round(diffMs / 60000); // 60000 миллисекунд в минуте
}

function sortAndGetTotalTime() {
    let tasksList = document.getElementById("today__tasks__block__list");
    let tasksWithTime = tasksList.querySelectorAll(".with__time");
    let totalDuration = 0; // Переменная счетчика для хранения суммы времени

    let sortedTasks = Array.from(tasksWithTime).sort((a, b) => {
        // Получаем время из каждого элемента
        let timeA = a
            .querySelector(".list__item__strend")
            .textContent.trim()
            .split(":");
        let timeB = b
            .querySelector(".list__item__strend")
            .textContent.trim()
            .split(":");

        // Преобразуем время в числа и сравниваем
        return (
            parseInt(timeA[0]) * 60 +
            parseInt(timeA[1]) -
            (parseInt(timeB[0]) * 60 + parseInt(timeB[1]))
        );
    });

    // Удаляем элементы с классом .with__time из tasksList
    tasksWithTime.forEach((task) => {
        // Получаем время из тега с классом .list__item__sepndtime
        let duration = task
            .querySelector(".list__item__sepndtime")
            .textContent.trim();
        // Разбиваем время на часы и минуты
        let timeSplitted = duration.split(" ");

        if (timeSplitted.length == 2) {
            totalDuration += parseInt(timeSplitted[0]);
        } else {
            totalDuration +=
                parseInt(timeSplitted[0]) * 60 + parseInt(timeSplitted[2]);
        }

        task.remove();
    });

    // Вставляем отсортированные элементы перед другими элементами
    sortedTasks.forEach((task) => {
        tasksList.insertBefore(task, tasksList.firstChild);
    });

    let h2Elements = document.querySelectorAll(".tasks__block__info__title h2");
    h2Elements.forEach((h2Element) => {
        if (h2Element.textContent.trim() === "Сегодня") {
            let parentDiv = h2Element.parentElement.parentElement;
            let timeDiv = parentDiv.querySelector(".tasks__block__info__time");
            console.log(totalDuration);
            if (totalDuration > 0) {
                timeDiv.textContent = formatDuration(totalDuration);
            } else {
                timeDiv.textContent = "";
            }
        }
    });
}

function makePopupOpen() {
    const popupLinks = document.querySelectorAll(".popup-link");
    const body = document.querySelector("body");

    let unlock = 800;

    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                const popupName = popupLink
                    .getAttribute("href")
                    .replace("#", "");
                const currPopup = document.getElementById(popupName);

                if (this.hasAttribute("data-item-id")) {
                    const itemId = this.getAttribute("data-item-id");
                    const hiddenInput =
                        currPopup.querySelector("[name='taskId']");
                    hiddenInput.value = itemId;
                    hiddenInput.dispatchEvent(new Event("change"));
                }

                popupOpen(currPopup);
            });
        }
    }
}
