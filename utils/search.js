const printInfo = info => {
    const { name, country, city } = info[0]
    const text = `Lo que queramos poner ${name}`

    document.querySelector('#result').innerHTML = text
}

const printError = name => {
    document.querySelector('#result').innerHTML = `<span style="color: red">El país ${name} no existe...</span>`
}

const getCountryInfo = name => {
    axios
        .get(`https://social-devnet.herokuapp.com/${name}${country}${city}`)
        .then(response => printInfo(response.data))
        .catch(err => printError(name))

}
document.querySelector('#countryName').onkeyup = () => {
    const countryValue = document.querySelector('#countryName').value
    getCountryInfo(countryValue)
}