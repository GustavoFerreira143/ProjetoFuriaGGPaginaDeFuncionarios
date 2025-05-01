import React from 'react'

function Footer() {
    function AcessaInsta()
    {
        window.location.href = 'https://www.instagram.com/furiagg/';
    }
    return (
        <div className='py-2 '>
            <hr />
            <div className='grid grid-cols-12 pt-5'>
                <div className='col-span-12 md:col-span-3 text-center pb-2'>
                    <p className='text-sm md:text-lg '>© 2024 Furia Gustavo Dev. All Rights Reserved.</p>
                </div>
                <div className='col-span-12 text-center md:text-start md:col-span-3 pl-2 pb-2'>
                    <p className='text-sm md:text-lg'>
                        INFORMAÇÕES
                    </p>
                    <a href="https://www.furia.gg/quem-somos" className='text-gray-600 text-sm text-xs' >Quem somos</a>
                    <br/>
                    <a href="https://www.furia.gg/faq" className='text-gray-600 text-sm text-xs'>FAQ</a>
                </div>
                <div className='col-span-12 text-center md:text-start md:col-span-3 pb-2'>
                    <p className='text-sm md:text-lg'>
                        POLÍTICAS  
                    </p>
                    <a href="https://www.furia.gg/termos-condicoes" className='text-gray-600 text-sm sm:text-xs'>Termos e Condições</a>
                    <br/>
                    <a href="https://www.furia.gg/politica-privacidade" className='text-gray-600 text-sm sm:text-xs'>Politicas de Privacidade</a>
                    <br/>
                    <a href="https://www.furia.gg/politica-cookie" className='text-gray-600 text-sm sm:text-xs'>Politica de Cookie</a>
                </div>
                <div className='col-span-12  md:col-span-3'>
                    <p className='text-center pb-3'>
                        Siga Furia
                    </p>
                    <div className='w-full flex justify-center'> 
                         <img src="/instagram.svg" className='cursor-pointer' onClick={AcessaInsta} />
                    </div>
                   
                </div>
            </div>
        </div>
    )
}

export default Footer