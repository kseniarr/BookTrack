import React, { useEffect, useState } from 'react'

const useRefresh = () => {
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        setRefresh((prev) => prev + 1);
    }, [])

    return (
        { refresh, setRefresh }
    )
}

export default useRefresh

