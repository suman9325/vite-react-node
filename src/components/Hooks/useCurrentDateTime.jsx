import { useEffect, useState } from "react";

// const useCurrentDateTime = () => {
//     const [currentDate, setCurrentDate] = useState(new Date())
//     return currentDate.toLocaleTimeString();
// }

// export default useCurrentDateTime;



// import { useEffect, useState } from "react";

const useCurrentDateTime = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // update every second

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    return currentDate;
};

export default useCurrentDateTime;
