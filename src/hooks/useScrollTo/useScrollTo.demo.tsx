import { useScrollTo } from "@/hooks/useScrollTo/useScrollTo";

const cardStyle = {
    border: '1px solid gray',
    height: 300,
    width: 300,
}

const Demo = () => {
    const {targetToScroll, scrollToTarget} = useScrollTo<HTMLDivElement>();

     const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        scrollToTarget(); 
    };

    
    return (
        <>
            <button onClick={handleClick}>Scroll to block 3</button>
            <div style={{overflow: 'auto', height: '320px', position: 'relative' }}>
                <div style={cardStyle}>Block 1</div>
                <div style={cardStyle}>Block 2</div>
                <div ref={targetToScroll} style={cardStyle}>Block 3</div>
        </div>
        </>
    )
}

export default Demo