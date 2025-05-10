import React from 'react'
import CallToAction from '../Components/CallToAction'

export const About = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About CodeCraft's Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem magni aliquam tempore! Blanditiis accusantium ducimus, consectetur voluptatum in voluptates mollitia possimus quo cumque sequi sit cum nam! Voluptates quis maiores temporibus accusantium officiis ea aut quibusdam saepe ipsum at ex dicta deleniti, est non recusandae explicabo! Vitae ad eaque perspiciatis doloremque esse voluptatum voluptas similique.
            </p>

            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad itaque molestias, quos eius veritatis maxime quae possimus, voluptates fugit vitae repellendus obcaecati nostrum. Quod in nobis, non quam libero similique optio explicabo delectus voluptatem, iste fugit iure dolorum veniam tempora, quas saepe voluptas incidunt quaerat nisi sapiente doloremque minus tenetur?
            </p>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod perspiciatis similique exercitationem vitae odit error cupiditate corrupti! Numquam a est exercitationem obcaecati minus, eius voluptatibus praesentium delectus odit asperiores cumque optio qui! Odit reiciendis, nostrum aliquam possimus eius suscipit numquam et animi adipisci. Facilis voluptatibus perspiciatis, placeat quam voluptate labore, libero non earum eaque et molestiae quia ab iure dolorum.
            </p>
          </div>
        </div>
        <div className='mt-10'>
          <CallToAction />
        </div>
      </div>
    </div>
  );
}
