type props = {
    width?: string | number;
    height?: string | number;
    fill?: string;
};

export function HamburguerIcon({
    width = 41,
    height = 33,
    fill = '#FFFFFF',
}: props) {
    return (
        <div  style={{ width, height, fill, }}>
            <svg
                style={{ width: 'inherit', height: 'inherit', fill: 'inherit' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="#FFFFFF"
                viewBox="0 0 256 256"
            >
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z">
                </path>
            </svg>


        </div>
    )
}
