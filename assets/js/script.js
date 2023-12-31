const selector = document.getElementById('selectMoney')
const btn = document.getElementById('btnBuscar')
const input = document.getElementById('inputMoney')
const resultado = document.getElementById('resultado')
const chart = document.getElementById('myChart')

const api_url = 'https://mindicador.cl/api'

async function getCoins(url) {
  try {
    const monedas = await fetch(url)
    const { dolar, dolar_intercambio, euro } = await monedas.json()
    return [dolar, dolar_intercambio, euro]
  } catch (error) {
    throw new Error(error)
  }
}

async function renderCoinOptions(url) {
  try {
    const select_container = selector
    const coins = await getCoins(url)

    coins.forEach((coin_info) => {
      const option = document.createElement('option')
      option.value = coin_info['codigo']
      option.innerText = coin_info['nombre']

      select_container.appendChild(option)

      console.log(coin_info)
    })
  } catch (error) {
    throw new Error(error)
  }
}

async function getCoinDetails(url, coinID) {
  try {
    if (coinID) {
      const coin = await fetch(`${url}/${coinID}`)
      const { serie } = await coin.json()
      const [{ valor: coinValue }] = serie

      return coinValue
    } else {
      alert('Seleciona una moneda')
    }
  } catch (error) {
    throw new Error(error)
  }
}

async function getAndCreateDataToChart(url, coinID) {
  const coin = await fetch(`${url}/${coinID}`)
  const { serie } = await coin.json()

  const labels = serie.map(({ fecha }) => {
    return fecha
  })

  const data = serie.map(({ valor }) => {
    return valor
  })

  const datasets = [
    {
      label: 'valores por fecha',
      borderColor: 'rgb(255, 99, 132)',
      data,
    },
  ]

  return { labels, datasets }
}

async function renderGrafica() {
  const option_selected = selector.value

  const data = await getAndCreateDataToChart(api_url, option_selected)
  console.log(data)
  const config = {
    type: 'line',
    data,
  }

  const canvas = chart
  canvas.style.backgroundColor = 'white'

  myChart = new Chart(canvas, config)
}

btn.addEventListener('click', async (event) => {
  const option_selected = selector.value

  const coinValue = await getCoinDetails(api_url, option_selected)

  const inputPesos = input.value

  resultado.innerHTML = `Resultado: $${(inputPesos / coinValue).toFixed(2)}`

  renderGrafica()
})

renderCoinOptions(api_url)
