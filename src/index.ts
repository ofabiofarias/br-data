import axios from 'axios'
import { Data, OutdatedData } from './types/data'

import * as fs from 'fs'

export enum TeamEnum {
  Guarani = 'GUA',
  Internacional = 'INT',
  Santos = 'SAN',
  Juventude = 'JUV',
  Cruzeiro = 'CRU',
  'Atlético pr' = 'CAP',
  Paysandu = 'PAY',
  'Ponte preta' = 'PON',
  Fluminense = 'FLU',
  Flamengo = 'FLA',
  Coritiba = 'CTB',
  Vasco = 'VAS',
  'Grêmio' = 'GRE',
  'Atlético mg' = 'CAM',
  Figueirense = 'FIG',
  Corinthians = 'COR',
  Fortaleza = 'FOR',
  Vitória = 'VIT',
  'São paulo' = 'SPA',
  'São caetano' = 'SCA',
  'Criciúma' = 'CRI',
  'Goiás' = 'GOI',
  'Paraná' = 'PAR',
  Bahia = 'BAH',
  'América rn' = 'AMN',
  Botafogo = 'BOT',
  Palmeiras = 'PAL',
  Brasiliense = 'BRA',
  Sport = 'SPT',
  'Santa cruz' = 'STA',
  Ipatinga = 'IPA',
  'Náutico' = 'NAU',
  Portuguesa = 'POR',
}

let startYear: number
let endYear: number

startYear = 2003
endYear = 2008

const results: Data[] = []

for (let year = startYear; year <= endYear; year++) {
  const { data } = await axios.get<OutdatedData[]>(
    `https://raw.githubusercontent.com/geovannyAvelar/Dados-Abertos-Campeonato-Brasileiro/master/${year}/${year}.json`,
  )

  for (const value of data) {
    for (const match of value.partidas) {
      const data = {
        rodada: value.numero.toString(),
        data: match.data_partida,
        horario: match.hora_partida,
        //@ts-ignore
        equipe1: TeamEnum[match.mandante],
        //@ts-ignore
        equipe2: TeamEnum[match.visitante],
        placar1: match.placar_mandante.toString(),
        placar2: match.placar_visitante.toString(),
        estadio: match.estadio,
        local: match.estadio,
        edicao: year.toString(),
      }

      results.push(data)
    }
  }

  console.log(`Dataset do ano ${year} carregado.`)
}

startYear = 2009
endYear = 2022

for (let year = startYear; year <= endYear; year++) {
  const { data } = await axios.get<Data>(`https://api.databinteligencia.com.br/brasileirao/jogos/${year}`)

  const values = Object.values(data)

  for (const value of values) {
    results.push({
      ...value,
      edicao: year,
    })
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
