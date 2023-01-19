let pubKeyNostr
let haveNostr = false
var sha256  = bitcoinjs.crypto.sha256

function checkNostr() {
    waitForDokiReady(function () {
        console.log()
        testNostr().then(r => {
            console.log()
            // console.log(pubKeyNostr, r)
            // console.log()
            // testSignEvent().then(e => {console.log(e)})
            // console.log()
        })

    })
}



async function testNostr() {
    if ( window.nostr ) {
        haveNostr = true
        console.log()
        pubKeyNostr = await window.nostr.getPublicKey();
        console.log()

    } else {
        console.log("no nostr")
    }
}

async function testSignEvent() {
    console.log()
    var now = Math.floor( Date.now() / 1000 );
    var event = {
        "content"    : "test note",
        "created_at" : now,
        "kind"       : 1,
        "tags"       : [],
        "pubkey"     : pubKeyNostr,
    }
    console.log()
    return await signEvent( event, privKey );
    //socket.send( JSON.stringify( [ "EVENT", signedEvent ] ) );
}

async function signEvent(event) {
    var eventArray = [
        0,                    // Reserved for future use
        event['pubkey'],        // The sender's public key
        event['created_at'],    // Unix timestamp
        event['kind'],        // Message “kind” or type
        event['tags'],        // Tags identify replies/recipients
        event['content']        // Your note contents
    ];
    var eventData = JSON.stringify( eventArray );
    event.id  = sha256( eventData ).toString( 'hex' )
    if (haveNostr) {
        var signedEvent = await window.nostr.signEvent( event );
        if ( typeof( signedEvent ) == "string" ) {
            event.sig = signedEvent;
        } else {
            event.sig = signedEvent.sig;
        }
        return event
    }
}