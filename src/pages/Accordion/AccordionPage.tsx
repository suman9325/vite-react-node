import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-bootstrap";
import React from 'react';

function AccordionPage() {

    const teamData = [
        {
            teamId: 1,
            teamName: 'India',
        },
        {
            teamId: 2,
            teamName: 'Australia',
        },
        {
            teamId: 3,
            teamName: 'Pakistan',
        }
    ]
    const playersData = [
        {
            teamId: 1,
            teamName: "India",
            players: [
                { playerId: 1, playerName: "Virat Kohli" },
                { playerId: 2, playerName: "Rohit Sharma" },
                { playerId: 3, playerName: "Jasprit Bumrah" },
                { playerId: 4, playerName: "Ravindra Jadeja" },
                { playerId: 5, playerName: "KL Rahul" },
                { playerId: 6, playerName: "Rishabh Pant" },
                { playerId: 7, playerName: "Hardik Pandya" },
                { playerId: 8, playerName: "Mohammed Shami" },
                { playerId: 9, playerName: "Shikhar Dhawan" },
                { playerId: 10, playerName: "Ajinkya Rahane" }
            ]
        },
        {
            teamId: 2,
            teamName: "Australia",
            players: [
                { playerId: 1, playerName: "Pat Cummins" },
                { playerId: 2, playerName: "Steve Smith" },
                { playerId: 3, playerName: "David Warner" },
                { playerId: 4, playerName: "Mitchell Starc" },
                { playerId: 5, playerName: "Glenn Maxwell" },
                { playerId: 6, playerName: "Travis Head" },
                { playerId: 7, playerName: "Josh Hazlewood" },
                { playerId: 8, playerName: "Marnus Labuschagne" },
                { playerId: 9, playerName: "Alex Carey" },
                { playerId: 10, playerName: "Nathan Lyon" }
            ]
        },
        {
            teamId: 3,
            teamName: "Pakistan",
            players: [
                { playerId: 1, playerName: "Babar Azam" },
                { playerId: 2, playerName: "Shaheen Afridi" },
                { playerId: 3, playerName: "Mohammad Rizwan" },
                { playerId: 4, playerName: "Shadab Khan" },
                { playerId: 5, playerName: "Fakhar Zaman" },
                { playerId: 6, playerName: "Imam-ul-Haq" },
                { playerId: 7, playerName: "Haris Rauf" },
                { playerId: 8, playerName: "Naseem Shah" },
                { playerId: 9, playerName: "Mohammad Nawaz" },
                { playerId: 10, playerName: "Iftikhar Ahmed" }
            ]
        }
    ];

    return (
        <Accordion>
            {teamData?.map((team, index) => (
                <AccordionItem eventKey={index.toString()}>
                    <AccordionHeader>{team?.teamName}</AccordionHeader>
                    <AccordionBody>
                        <ul className="text-start">
                            {((playersData?.filter(players => players.teamId === team?.teamId))?.[0]?.players)?.map((p, index) => (
                                <li key={index}>{p?.playerName}</li>
                            ))
                            }
                        </ul>
                    </AccordionBody>
                </AccordionItem>
            ))
            }
        </Accordion>
    );
}

export default AccordionPage;