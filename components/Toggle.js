import React, { useState } from 'react'

function Toggle({block,child}) {
    const [isToggled, setIsToggled] = useState(false);
    const mainval = block?.toggle?.rich_text.map((val) => {
      return <div>{val?.plain_text}</div>;
    });
    let newArray = [];

    const togggle = child?.map((value) => {
      if (value?.parent?.block_id === block?.id) {
        {
          value?.paragraph.rich_text.map((val) => {
            return newArray.push(val);
          });
        }
        return;
      }
    });
    // return <div>Toggle</div>
    return (
      <div className="my-5 ml-0 ">
        <div className="flex items-center">
          <div
            className={`h-[18px] cursor-pointer ${
              isToggled ? "transform rotate-90 duration-300 ease-in-out" : null
            }`}
            onClick={() => setIsToggled(!isToggled)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
            </svg>

          </div>
          <div className="ml-2 text-lg font-medium ">{mainval}</div>
        </div>
        {isToggled && (
          <div className="mt-2 text-base ml-7">
            {newArray?.map((val) => {
              return (
                <div className="my-2 text-gray-700">
                  {val?.text.link == null ? (
                    val?.text.content
                  ) : (
                    <a href={val?.text.link.url}>{val?.text.content}</a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
}

export default Toggle