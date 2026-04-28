'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { useFadeNavigate } from '~/components/RouteTransition';
import pageStyles from "~/theme/Page.module.css";

type PageHeaderProps = {
    title: string;
    backLink?: string;
}

export default function PageHeader({ title, backLink }: PageHeaderProps) {
    const navigate = useFadeNavigate();

    const handleBack = () => {
        if (backLink) {
            navigate(backLink);
        }
    };

    return (
        <div className={pageStyles.pageHeader}>
            {backLink ? <Button className="btn-action-back" onClick={handleBack}><ArrowLeft size={20} strokeWidth={1.5} /> </Button> : <Button className="btn-action-back" style={{ visibility: 'hidden' }} ><ArrowLeft size={20} strokeWidth={1.5} /> </Button>}
            <h1>{title}</h1>
            <Button className="btn-action-back" style={{ visibility: 'hidden' }} ><ArrowLeft size={20} strokeWidth={1.5} /> </Button>
        </div>
    )
}