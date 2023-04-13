import { ReactNode } from 'react';

type ButtonProps = {
    children: ReactNode;
    onClick: () => void;
};

const Button = ({ onClick, children }: ButtonProps) => {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
        >
            {children}
        </button>
    );
};

export default Button;
