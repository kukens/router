'use client'

import { Link } from "react-router";
import { Button, Card } from "flowbite-react";

export default function Home() {
    return (
        <main className="">
            <Link to="/quick-jam">
                <Card className="max-w-sm">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Workout
                    </h2>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Pick your style and start playing.
                    </p>
                </Card>
            </Link>

            <Link to="/chord-tracks">
                <Card className="max-w-sm">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Chord Tracks
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Build a collection of custom chord sequences and practice them.
                    </p>
                </Card>
            </Link>

            <Link to="/learning-path">
                <Card className="max-w-sm">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Learning Path
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Follow a structured journey and Level up your skills.
                    </p>
                </Card>
            </Link >

        </main>
    );
}
