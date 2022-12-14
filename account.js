function displayAccount() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Account Details (Currently logged in)"
    document.getElementById("content").replaceChildren(renderAccountDetails())
    document.getElementById("details").replaceChildren(updateAccountDetails(), document.createElement("br"), recoverSeed(), document.createElement("br"),  opReturnForm())
}

function isParticipant(pubkey) {
    let ident;
    ident = identityObjects.get(pubkey)
    if (typeof ident === "undefined") {
        //
    } else {
        if (ident.UshBy.length > 0) {
            return true
        }
    }
    return false
}

function hasPermanym(pubkey) {
    let ident;
    ident = identityObjects.get(pubkey)
    if (typeof ident === "undefined") {
        //
    } else {
        if (ident.Name.length > 0) {
            return true
        }
    }
    return false
}

function renderAccountDetails() {
    // box = document.createElement("div")
    // box.className = "box"
    // heading = document.createElement("div")
    // heading.className = "is-3"
    // heading.textContent = "Current Account Details"
    // box.appendChild(heading)
    deets = document.createElement("div")
    deets.className = "content"
    let ident;
    ident = identityObjects.get(pubKeyMinus2)
    if (typeof ident === "undefined") {
        ident = {Account: pubKeyMinus2, Name: "", About: "", UshBy: ""}
    }
    deets.appendChild(createElement("Help", "A new account and corrosponding seed words are generated when you first load this page. \nTo generate a new account, clear your browser's data for this site and reload it.\nIf you start using this account, you should write down your seed words (especially if you claim a Permanym that you want to keep)."))
    deets.appendChild(createElement("Account", ident.Account))
    deets.appendChild(createElement("Seed Words - write these down if you want to continue using this Account.", localStorage.getItem('backupwords')))
    deets.appendChild(createElement("Permanym (permanent psudonym)", ident.Name))
    deets.appendChild(createElement("About", ident.About))
    var ushby;
    if (ident.UshBy.length > 0) {
        ushby = ident.UshBy
    } else {
        ushby = "No one has validated that you are human yet. Post a message in the Samizdat tree to ask."
    }
    deets.appendChild(createElement("Added to the Participant Tree by:", ushby))
    deets.appendChild(createElement("Vouched for by", "no one has vouched for you yet"))
    deets.appendChild(createElement("Total Shares", "0"))
    deets.appendChild(createElement("Lead Time", "0"))
    deets.appendChild(createElement("Lead Time Unlocked Shares", "0"))
    deets.appendChild(createElement("Lead Time Locked Shares", "0"))
    deets.appendChild(createElement("Voting Power", "0"))
    deets.appendChild(createElement("Maintainer", "false"))
    deets.appendChild(createElement("Problems Logged", "0"))
    deets.appendChild(createElement("Problems Claimed", "0"))
    deets.appendChild(createElement("Problems Solved", "0"))
    deets.appendChild(createElement("Expenses Filed", "0"))
    deets.appendChild(createElement("Expenses Approved", "0"))
    return deets
}

function createElement(key, value) {
    box = document.createElement("div")
    box.className = "box"
    k = document.createElement("strong")
    k.innerText = key
    v = document.createElement("p")
    v.innerText = value
    b = document.createElement("br")
    box.appendChild(k)
    box.appendChild(b)
    box.appendChild(v)
    return box
}

function recoverSeed() {
    form = document.createElement("div")
    ident = identityObjects.get(pubKeyMinus2)
    form.innerHTML = `
<h3 class="is-3">Import your existing account</h3>
<div class="content">
//todo: I can't get nos2x working cause I'm dumb
<br /><br />
Adding your seed words or private key here will replace the current keypair in your browser's LocalStorage for this site.
<br /><br />
<h4 class="is-4">Note for existing Nostr users</h4>
Instead of importing your existing Nostr seed words or private key, you can simply register your <b>existing Nostr <i>username</i></b> as a Permanym for the pubkey ("Account") that you're currently signed in with (it was auto-generated when you first loaded this page). <b>Record your seed words</b> if you do this.
<br /><br />
You can then provide a proof (event signed with alby or nos2x AND your existing Stackerstan pubkey) to <b>add your Nostr pubkey to this Account</b>. Events from <b>both</b> pubkeys are then <b>valid for your Stackerstan Account</b> (not implemented yet but probably coming soon).
</div>
<div class="field">
  <label class="label">Seed Words OR Private Key</label>
  <div class="control">
    <textarea class="textarea" placeholder="Paste your seed words OR your private key here" id="seed input"></textarea>
  </div>
</div>

<div class="field is-grouped">
  <div class="control">
    <button class="button is-link" onclick="restoreAccount( document.getElementById('seed input').value); location.reload()">Submit</button>
  </div>
  <div class="control">
    <button class="button is-link is-light" onclick="document.getElementById('seed input').value = '';">Cancel</button>
  </div>
</div>
    `
    return form
}

function restoreAccount(data) {
    if (data.length === 64) {
        localStorage.removeItem("backupwords")
        localStorage.setItem("privatekey", data)
        location.reload()
    }
    localStorage.setItem('backupwords', data)
    location.reload()
}

function updateAccountDetails() {
    form = document.createElement("div")
    ident = identityObjects.get(pubKeyMinus2)
    form.innerHTML = `
<h3 class="is-3">Modify your profile</h3>
<div class="content">
See "Non-fungible Identity" in the Stackerstan Superprotocolo.
<br /><br />
A Permanym is a handle or username that cannot be changed once it has been set for your Pubkey. It MUST be unique within Stackerstan.
<br /><br />
The Superprotocolo requires a minimum Levenshtein distance between any new Permanym and all existing Permanyms, but this is not implemented yet. 
</div>
    <div class="field">
  <label class="label">Permanym</label>
  <div class="control">
    <input class="input" type="text" placeholder="Name or Pseudonym" id="name input" maxlength="20">
  </div>
</div>
The About Me section of your Profile is a short bio that can be modified whenever you want, but every version is retained permanently and included in OP_RETURN states.
<div class="field">
  <label class="label">About Me</label>
  <div class="control">
    <textarea class="textarea" placeholder="About" id="about input" maxlength="560"></textarea>
  </div>
</div>

<div class="field is-grouped">
  <div class="control">
    <button class="button is-link" onclick="setBio( document.getElementById( 'name input' ).value, document.getElementById( 'about input' ).value )" >Submit</button>
  </div>
  <div class="control">
    <button class="button is-link is-light" onclick="document.getElementById('name input').value = '';document.getElementById('about input').value = ''; ">Cancel</button>
  </div>
</div>
    `
return form
}

function setBio(name, about) {
    sequence = 0
    if (identityObjects.get(pubKeyMinus2) !== undefined) {
        sequence = identityObjects.get(pubKeyMinus2).Sequence
    }
    sequence++
    content = JSON.stringify({name: name, about: about, sequence: sequence})
    et = makeEvent(content, "", 640400)
    signHash(et.id).then(function (result) {
        et.sig = result
        sendIt(et)
        console.log(et)
        location.reload()
    })
}

function opReturnForm() {
    let div = document.createElement("div")
    head = document.createElement("h3")
    head.className = "is-3"
    head.innerText = "Register OP_RETURN address for your pubkey"
    div.appendChild(head)
    let address = document.createElement("input")
    address.type = "text"
    address.placeholder = "Bitcoin Address"
    address.className = "input is-primary"
    let proof = document.createElement("textarea")
    proof.className = "textarea"
    proof.placeholder = "Proof (BIP322 of your pubkey)"
    proof.className = "textarea is-primary"
    let submitbtn = document.createElement("button")
    submitbtn.textContent = "Make it so"
    submitbtn.className = "button is-primary"
    submitbtn.onclick = function () {
        setOpReturn(address.value, proof.value)
        proof.value = ""
        address.value = ""
    }
    div.appendChild(address)
    div.appendChild(proof)
    div.appendChild(submitbtn)
    return div
}

function setOpReturn(address, proof) {
    sequence = 0
    if (identityObjects.get(pubKeyMinus2) !== undefined) {
        sequence = identityObjects.get(pubKeyMinus2).Sequence
    }
    sequence++
    let content = {"address": address, "proof": proof, sequence: sequence}
    let c = JSON.stringify(content)
    let e = makeEvent(c, "", 640406)
    signHash(e.id).then(
        function (result) {
            e.sig = result
            sendIt(e)
            location.reload()
        }
    )
}