import React from 'react'

const HobbiesList = ({hobbies}) => {
    return (
        <div className="flex flex-wrap gap-2">
          {hobbies?.map((hobbyObj, index) => (
            <div 
              key={index} 
              className="border border-white rounded-md px-3 py-1 text-white text-sm"
            >
              {hobbyObj.hobby} {/* Access the hobby name */}
            </div>
          ))}
        </div>
    );
}

export default HobbiesList