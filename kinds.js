

let kindsReady = false
function waitForKindsReady(callback) {
    var interval = setInterval(function() {
        if (kindsReady) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

function displayKinds() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Nostr Event Kind Registry"// spontaneously organising tree of self-published notes and other stuff
    document.getElementById("content").replaceChildren(loadingSign())
    waitForKindsReady(function () {
        renderKinds()
    })
    rewriteURL("nostr-event-kind-registry")
}

function renderKinds() {
    box = document.createElement("div")
    box.className = "content"
    document.getElementById("content").replaceChildren(box)
    table = document.createElement("table")
    table.className = "table"
    thead = document.createElement("thead")
    theadr = document.createElement("tr")
    theadr.appendChild(createTh("Kind"))
    theadr.appendChild(createTh("Count"))
    theadr.appendChild(createTh("NIP"))
    theadr.appendChild(createTh("App"))
    theadr.appendChild(createTh("Description"))
    theadr.appendChild(createTh("Curator"))
    thead.appendChild(theadr)
    table.appendChild(thead)
    tbody = document.createElement("tbody")
    eventbucketObjects.forEach(function (v,k) {
        if (v > 0) {
            tbodyr = document.createElement("tr")
            tbodyr.appendChild(createTd(k))
            tbodyr.appendChild(createTd(v))
            tbodyr.appendChild(createTd("add"))
            if ((k >= 640000) && (k < 650000)) {
                tbodyr.appendChild(createTd("Stackerstan"))
            } else if (k < 8) {
                tbodyr.appendChild(createTd("Generic"))
            } else {
                tbodyr.appendChild(createClaimButton())
            }


            tbodyr.appendChild(createTd("feature coming soon"))
            tbodyr.appendChild(createClaimButton())
            tbody.appendChild(tbodyr)
        }
    })
    table.appendChild(tbody)
    box.appendChild(table)
}

function createTh(title) {
    theadh = document.createElement("th")
    theadh.innerText = title
    return theadh
}

function createTd(title) {
    theadh = document.createElement("td")
    if (title !== undefined) {
        theadh.innerText = title
    }
    return theadh
}

function createClaimButton() {
    claim = createTd()
    claimLink = document.createElement("button")
    claimLink.className = "button is-small is-primary"
    claimLink.innerText = "claim"
    claim.appendChild(claimLink)
    return claim
}

