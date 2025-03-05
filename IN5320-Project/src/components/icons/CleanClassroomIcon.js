import React from "react";

export const CleanClassroomIcon = ({size}) => {
    return (
        <div style={{position: 'relative', height:`${size}px`, width:`${size}px`}}>
            <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960"
                 width={`${size}px`} fill="currentColor">
                <path
                    d="M153.33-120q-14.16 0-23.75-9.62-9.58-9.61-9.58-23.83 0-14.22 9.58-23.72 9.59-9.5 23.75-9.5H208v-620q0-14.16 9.58-23.75 9.59-9.58 23.75-9.58H568q14.17 0 23.75 9.58 9.58 9.59 9.58 23.75v10h118q14.17 0 23.75 9.59 9.59 9.58 9.59 23.75v576.66h54q14.16 0 23.75 9.62 9.58 9.62 9.58 23.83 0 14.22-9.58 23.72-9.59 9.5-23.75 9.5h-87.34q-14.16 0-23.75-9.58-9.58-9.59-9.58-23.75V-730h-84.67v576.67q0 14.16-9.58 23.75Q582.17-120 568-120H153.33Zm121.34-653.33v586.66-586.66ZM487.33-480q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5q17 0 28.5-11.5t11.5-28.5ZM274.67-186.67h260v-586.66h-260v586.66Z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width={`${-1+size/2}px`} height={`${-1+size}px`}
                 viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round"
                 style={{position: 'absolute', top: `${size/size - 3}px`, right: `${size/2+size/7}px`}}>
                <path
                    d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                <path d="M20 3v4"/>
                <path d="M22 5h-4"/>
                <path d="M4 17v2"/>
                <path d="M5 18H3"/>
            </svg>
        </div>
    );
}