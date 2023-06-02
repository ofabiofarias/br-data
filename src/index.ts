import axios from 'axios'
import { Data } from './types/data'

import * as fs from 'fs'

const api = axios.create({
  baseURL: 'https://api.databinteligencia.com.br/brasileirao/jogos',
})

const startYear: number = 2009
const endYear: number = 2022

const results: Data[] = []

for (let year = startYear; year <= endYear; year++) {
  const { data } = await api.get<Data>(`${year}`)

  const values = Object.values(data)

  for (const value of values) {
    results.push({ ...value, edicao: year })
  }

  console.log(`Dataset do ano ${year} carregado.`)
}

const writeStream = fs.createWriteStream('data.json')
writeStream.write(JSON.stringify({ ...results }))
writeStream.end()

writeStream.on('finish', () => {
  console.log('Arquivo JSON foi escrito com sucesso.')
})

writeStream.on('error', (err: any) => {
  console.error('Ocorreu um erro ao escrever o arquivo JSON:', err)
})
