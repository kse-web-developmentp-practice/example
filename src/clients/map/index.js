let fetchFn
let baseUrl
let apiKey

function init(url, key, fetchAPI) {
  fetchFn = fetchAPI
  baseUrl = url
  apiKey = key
}

async function update(item) {
  const objectId = item._id

  if (!objectId) {
    throw Error('Item should contain `_id`')
  }

  const url = `${baseUrl}/rest/mapitem/${item._id}`

  const headers = {
    'Content-Type': 'application/json',
    'x-apikey': apiKey
  }

  const res = await fetchFn(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(item)
  })

  if (!res.ok || res.status !== 200) {
    throw new Error(`Error: ${res.statusText}`)
  }

  return true
}

async function create(title, lat, lng) {
  const url = `${baseUrl}/rest/mapitem`

  const headers = {
    'Content-Type': 'application/json',
    'x-apikey': apiKey
  }

  const res = await fetchFn(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title,
      lat,
      lng
    })
  })

  if (!res.ok || res.status !== 201) {
    throw new Error(`Error: ${res.statusText}`)
  }

  return await res.json()
}

async function getByBounds(latMin, latMax, lngMin, lngMax) {
  const query = {
    lat: {
      $bt: [latMin, latMax]
    },
    lng: {
      $bt: [lngMin, lngMax]
    }
  }

  return getData(query)
}

async function getList(page = 0) {
  const perPage = 5
  const skip = perPage * page
  return getData(null, skip, perPage)
}

async function getData(query = '', skip, max) {
  const searchParams = new URLSearchParams()

  if (query) {
    searchParams.append('q', JSON.stringify(query))
  }

  if (skip) {
    searchParams.append('skip', skip)
  }

  if (max) {
    searchParams.append('totals', true)
    searchParams.append('max', max)
  }

  const url = `${baseUrl}/rest/mapitem?${searchParams.toString()}`

  const headers = {
    'cache-control': 'no-cache',
    'x-apikey': apiKey
  }

  const res = await fetchFn(url, {
    method: 'GET',
    headers
  })

  if (!res.ok || res.status !== 200) {
    throw new Error(`Error: ${res.statusText}`)
  }

  const data = await res.json()
  if (data.length < 1) {
    return []
  }
  return data
}

export default {
  init,
  getByBounds,
  getList,
  create,
  update
}
