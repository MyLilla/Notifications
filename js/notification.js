update()

document.querySelector(".notification__form > button").addEventListener("click",
    function () {
        let time = document.querySelector(".notification__form input").value
        let message = document.querySelector(".notification__form textarea").value

        let info = document.querySelector(".notification__info")

        if (!time || !message) {
            info.textContent = "Specify correct time and message"
            info.style.opacity = 1
            setTimeout(() => {
                info.style.opacity = 0
            }, 2000)
            setTimeout(() => {
                info.innerHTML = ""
            }, 3000)
            return
        }
        localStorage.setItem(time, message)
        update()
    }
)

document.querySelector(".notification__list > button").addEventListener("click",
    function () {
        if (localStorage.length && confirm("Clean notification list?")) {
            localStorage.clear()
        }
        update()
    }
)

function update() {
    if (!localStorage.length) {
        document.querySelector(".notification__list").hidden = true
    } else {
        document.querySelector(".notification__list").hidden = false
    }
    document.querySelector(".notification__list > div").textContent = ""
    document.querySelector(".notification__info").textContent = ""


    for (let key of Object.keys(localStorage)) {
        document.querySelector(".notification__list > div").insertAdjacentHTML
            ("beforeend", `
            <div class="notification__item">
            ${key} - ${localStorage.getItem(key)}
            <button data-time="${key}">&times</button>
            </div>`)
    }

    document.querySelector(".notification__form input").value = ""
    document.querySelector(".notification__form textarea").value = ""

    if (document.querySelector(".audio_alert")) {
        document.querySelector(".audio_alert").remove()
    }

}

document.querySelector(".notification__list").addEventListener("click",
    function (e) {
        if (!e.target.dataset.time) {
            return
        }
        localStorage.removeItem(e.target.dataset.time)
        update()
    }
)

setInterval(function () {
    let currentDate = new Date()

    let hours = currentDate.getHours()
    if (hours < 10) {
        hours = "0" + hours
    }
    let minutes = currentDate.getMinutes()
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    let currentTime = hours + ":" + minutes

    for (let key of Object.keys(localStorage)) {
        let hoursItm = key.split(":")[0]
        let minsItm = key.split(":")[1]

        if (currentTime == key || hoursItm == hours && minsItm < minutes) {
            document.querySelector(`button[data-time="${key}"]`).closest(
                ".notification__item").classList.add("notification__warning")

            if (!document.querySelector(".audio_alert")) {
                document.querySelector("body").insertAdjacentHTML("afterbegin",
                    `<audio loop class="audio_alert">
                    <source src="../source/alert.mp3" type="audio/mpeg"></audio>`
                )
                document.querySelector(".audio_alert").play()
            }
        }
    }
}, 1000)