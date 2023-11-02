import React from 'react';

const ValueCard = ({  title  }) => {
    return (
      <>
        <div class="mx-auto mb-10 block max-w-[18rem] rounded bg-white text-left shadow-2xl border-b-8 border-sky-600">
          <div class="p-6">
            <h5 class="text-center mb-1 text-xl font-medium leading-tight text-sky-600">
              { title }
            </h5>
            <p class="mb-6 mt-6 text-base  leading-normal text-neutral-600">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </div>
      </>
    );
}
 
export default ValueCard;