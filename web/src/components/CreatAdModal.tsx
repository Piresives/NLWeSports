import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import Axios from 'axios'

import { Check, GameController } from 'phosphor-react'
import { Input } from './forms/Input'

import { useState, useEffect, FormEvent } from 'react'

interface Game{
    id: string;
    title: string;
  }
  

export function CreatADModal(){
    const [games, setGames] =useState<Game[]>([])
    const [weekDays, setWeekDays] = useState<string[]>([])
    const [useVoiceChannel, setUseVoiceChannel] = useState(false)

    console.log(weekDays)

    useEffect(() => {
        Axios('http://localhost:3333/games').then(response =>{
          setGames(response.data)
        })
    },[])

    async function handleCreateAd(event: FormEvent){
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData)

        if(!data.name) {
            return;
        }

        try{
           await Axios.post(`http://localhost:3333/games/${data.game}/ads`, {
            "name": data.name,
            "yarsPlaying": Number(data.yarsPlaying), 
            "discord": data.discord,
            "weekDaays": weekDays.map(Number),
            "hoursStart": data.hoursStart,
            "hoursEnd": data.hoursEnd,
            "useVoiceChannel": useVoiceChannel
        })
        alert('Anúncio criado com sucesso!')
        }catch (err){
            console.log(err);
            alert('Erro ao criar anúncio!')
        }
    }
    
    return(
        <Dialog.Portal>
            <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>
            
            <Dialog.Content className='fixed bg-[#2a2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>
            <Dialog.Title className='text-3xl font-black'>Publique um anúncio</Dialog.Title>

            <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="game" className='font-semibold'>Qual o game?</label>
              <select
              name='game'
              id="game" 
              className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none"
              defaultValue="">
                <option disabled value="">Selecione o game que você deseja jogar</option>
              
              {games.map(game => {
                return <option key={game.id} value={game.id}>{game.title}</option>
              })}
              </select>
              
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="name">Seu nome (ou nickname)</label>
              <Input name='name' id='name' placeholder='Como te chamam dentro do game?'/>
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="yarsPlaying">Joga há quantos anos?</label>
                <Input name='yarsPlaying' id='yarsPlaying' type="number" placeholder='Tudo bem ser ZERO'/>
              </div>
              <div className='flex flex-col gap-2'>
              <label htmlFor="discord">Qual seu Discord?</label>
                <Input name='discord' id='discord' placeholder='Usuario0000'/>                
              </div>
            </div>

            <div className='flex gap-6'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="weekDaays">Quando costuma jogar?</label>

                <ToggleGroup.Root 
                 type='multiple' 
                 className='grid grid-cols-4 gap-2'
                 value={weekDays}
                 onValueChange={setWeekDays}>

                <ToggleGroup.Item 
                 value="0" 
                 className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : ' bg-zinc-900'}`} 
                 title='Domingo'>
                    D
                </ToggleGroup.Item>

                <ToggleGroup.Item 
                 value="1" 
                 className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : ' bg-zinc-900'}`}  
                 title='Segunda'>
                    S
                </ToggleGroup.Item>

                <ToggleGroup.Item 
                 value="2" 
                 className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : ' bg-zinc-900'}`}  
                 title='Terça'>
                    T
                </ToggleGroup.Item>

                <ToggleGroup.Item 
                 value="3" 
                 className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : ' bg-zinc-900'}`}  
                 title='Quarta'>
                    Q
                </ToggleGroup.Item>

                <ToggleGroup.Item 
                 value="4" 
                 className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : ' bg-zinc-900'}`}  
                 title='Quinta'>
                    Q
                </ToggleGroup.Item>

                <ToggleGroup.Item 
                 value="5" 
                 className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : ' bg-zinc-900'}`}  
                 title='Sexta'>
                    S
                </ToggleGroup.Item>

                <ToggleGroup.Item 
                 value="6" 
                 className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : ' bg-zinc-900'}`}  
                 title='Sábado'>
                    S
                </ToggleGroup.Item>

                </ToggleGroup.Root>
              </div>

              <div className='flex flex-col gap-2 flex-1'>
                <label htmlFor="hoursStart">Qual horário do dia?</label>
                <div className='grid grid-cols-2 gap-2'>
                  <Input name='hoursStart' id='hoursStart' type="time" placeholder='De' />
                  <Input name='hoursEnd' id='hoursEnd' type="time" placeholder='Até' />
                </div>
              </div>
            </div>

            <label className='mt-2 flex items-center gap-2 text-sm'>
              <Checkbox.Root
              checked= {useVoiceChannel}
              onCheckedChange={(checked) => {
                if (checked === true){
                    setUseVoiceChannel(true)
                } else{
                  setUseVoiceChannel(false)
                }}
                }
              
              className='w-6 h-6 rounded bg-zinc-900'>
                <Checkbox.Indicator>
                    <Check className='w-6 h-6 p-1 text-emerald-400'/>
                </Checkbox.Indicator>
              </Checkbox.Root>
              Costumo me coectar ao chat de voz
            </label>

            <footer className='mt-4 flex justify-end gap-4'>
              <Dialog.Close
               type='button'
               className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'>
                Cancelar
              </Dialog.Close>
              <button type='submit' className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'>
                <GameController className='w-6 h-6'/>
                Encontrar duo
              </button>
            </footer>
          </form>
          </Dialog.Content>
        </Dialog.Portal>
    )
}

function axios(arg0: string) {
    throw new Error('Function not implemented.');
}
