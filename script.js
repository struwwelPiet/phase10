let players = []
const colors = ['#41516c', '#107893', '#4ec4a4', '#d13a41', '#fc833e', '#ffaf12', '#72627d', '#7a8ea7', '#eaaa9e', '#a19b9b', '#575c46', '#efdaa5']

const dom = {
    colorSelector: document.querySelector('.colors'),
    welcomePlayers: document.querySelector('.welcome-players'),
    phaseSelectClassic: document.querySelector('#classic + label ul'),
    phaseSelectMaster: document.querySelector('#master + label ul'),
    phaseInputs: document.querySelectorAll('#phases input'),
    phaseBoard: document.querySelector('#phase-board'),
}

const phases = {
    classic: ['2 Drillinge', '1 Drilling + 1 Viererfolge', '1 Vierling + 1 Viererfolge', '1 Siebenerfolge', '1 Achterfolge', '1 Neunerfolge', '2 Vierlinge', '7 Karten einer Farbe', '1 Fünfling + 1 Zwilling', '1 Fünfling + 1 Drilling'],
    master: ['3 Drillinge', '6 Karten einer Farbe', '1 Vierling + 1 Viererfolge', '1 Achterfolge', '7 Karten einer Farbe', '1 Neunerfolge', '2 Fünflinge', '1 Viererfolge einer Farbe + 1 Vierling', '1 Fünfling + 1 Vierling', '1 Fünfling + 1 Fünferfolge']
}

function updatePlayerView() {
    dom.welcomePlayers.innerHTML = ''

    players.forEach(p => {
        let player = document.createElement('div')
        player.classList.add('welcome-player')
        player.style.borderColor = p.color
        player.innerText = p.name
        player.dataset.id = p.id
        dom.welcomePlayers.insertAdjacentElement('beforeend', player)
    })
}

function updatePhaseMap() {
    let mode = Array.from(dom.phaseInputs).find(i => i.checked).getAttribute('id')

    let markup = phases[mode].map((p, i) => {
        let playersInPhase = players.filter(pl => pl.phase == i+1)
        let playersMarkup = playersInPhase.map(pl => `<span class="badge" style="background: ${pl.color}; margin-right: 5px;">${pl.name}</span>`).join('')
        return `<li class="list-group-item">${p}<br>${playersMarkup}</li>`
    }).join('')

    dom.phaseBoard.innerHTML = markup
}

function addPlayer() {
    let name = document.querySelector('#name')
    let color = Array.from(document.querySelectorAll('.colors input')).find(r => r.checked).value
    let id = Date.now().toString(32)

    players.push({id: id, name: name.value, color: color, phase: 1, points: 0})
    name.setAttribute('value', '')

    updateViews()
}

function updateViews() {
    updatePhaseMap()
    updatePlayerView()
    updatePointsView()

    localStorage.setItem('players', JSON.stringify(players))
}

function changePhase(id, delta) {
    players.find(p => p.id == id).phase += delta
    updateViews()
}

function updatePointsView() {
    let markup = players.map(p => 
        `<div class="card mb-3 text-center" style="width: 18rem; border: 3px solid ${p.color}" data-id="${p.id}">
            <div class="card-body">
                <h5 class="card-title">${p.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${p.points} Punkte</h6>
                <div class="btn-group mb-3" role="group" aria-label="Punkte für ${p.name}">
                    <button type="button" class="btn btn-light" onclick="changePhase('${p.id}', -1)" ${p.phase <= 1 ? 'disabled' : ''}>-</button>
                    <div class="btn btn-light" style="width: 130px">Phase ${p.phase}</div>
                    <button type="button" class="btn btn-light" onclick="changePhase('${p.id}', 1)" ${p.phase >= 10 ? 'disabled' : ''}>+</button>
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="points_${p.id}">Punkte</span>
                    <input type="number" value="0" class="form-control" placeholder="" aria-label="points_${p.id}" aria-describedby="points_${p.id}">
                    <button class="btn btn-outline-secondary" type="button" onclick="addPoints(this)" style="width: 40px">+</button>
                </div>
            </div>
        </div>`
    ).join('')

    document.querySelector('#players-view').innerHTML = markup
}

function addPoints(e) {
    let id = e.parentNode.parentNode.parentNode.dataset.id
    let points = e.parentNode.querySelector('input').value
    players.find(p => p.id == id).points += parseInt(points)

    updateViews()
}


window.onload = () => {
    let lsPlayers = localStorage.getItem('players')
    if (lsPlayers && lsPlayers != '[]' && confirm('Willst du das letzte Spiel aufgreifen?')) {
        players = JSON.parse(lsPlayers)
    } else {
        players = []
    }

    colors.forEach((c, i) => {
        let markup = `<input type="radio" name="color" id="c${i}" value="${c}" ${i == 0 ? 'checked' : ''}>
        <label class="col" for="c${i}" style="background: ${c}"></label>`

        dom.colorSelector.insertAdjacentHTML('beforeend', markup)
    })

    dom.phaseSelectClassic.innerHTML = phases.classic.map(p => `<li class="list-group-item">${p}</li>`).join('')
    dom.phaseSelectMaster.innerHTML = phases.master.map(p => `<li class="list-group-item">${p}</li>`).join('')

    updateViews()
}

