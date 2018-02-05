import React from 'react';
import { Grid, Row, Col, Nav, NavItem, Button, ButtonGroup, Badge, Glyphicon }  from 'react-bootstrap';

const defaultOptions = {
    bsTabStyle: "pills",
    justified: true,
    disableOnInvalid: true,
    labels: {
        prev: "Previous",
        next: "Next",
        finish: "Finish",
    },
}

export function createRenderer(userOptions = {}) {

    let options = {
        ...defaultOptions,
        ...userOptions,
    };

    return {
        wiz: (tabs, content, nav) => 
            wiz(tabs, content, nav),
        tabsContainer: (tabs) => 
            tabsContainer(tabs, options.bsTabStyle, options.justified),
        tab: (step, index, current, hideNumbers, changeStep) => 
            tab(step, index, current, hideNumbers, changeStep, options),
        stepsContainer: (steps) => 
            stepsContainer(steps),
        step: (stepData, index, current, setStepActiveStatus, isStepActive, stateManager) =>
            step(stepData, index, current, setStepActiveStatus, isStepActive, stateManager),
        nav: (first, last, valid, prev, next, finish) => 
            nav(first, last, valid, prev, next, finish, options),
    };

}

export default createRenderer();

function wiz(tabs, content, nav) {
    return (
        <Grid>
            {tabs}
            {content}
            {nav}
        </Grid>
    );
}

function tabsContainer(tabs, style, justified) {
    return (
        <Nav bsStyle={style} className="nav-wizard" justified={justified}>{tabs}</Nav>
    );
}

function tab(step, index, current, hideNumbers, changeStep, { disableOnInvalid }) {
    const numberBadge = hideNumbers ? null : <Badge>{step.number}</Badge>;
    let icon = <Glyphicon glyph="ok" style={{visibility: 'hidden'}} />;

    if (step.touched && (disableOnInvalid || step.submitted)) {
        if (step.valid) {
            icon = <Glyphicon glyph="ok" />;
        } else {
            icon = <Glyphicon glyph="remove" className="text-danger" />;
        }
    }

    return (
        <NavItem key={index} active={current}
            className={step.valid ? 'valid ' : ' '}
            disabled={!step.navigable || current}
            style={{
                display: step.active !== false ? 'table-cell' : 'none',
                cursor: step.navigable ? 'pointer' : 'not-allowed',
            }}
            onClick={changeStep}>
            {numberBadge}
            <span style={{margin: "0 5px"}}>{step.title}</span>
            {icon}
        </NavItem>
    );
}

function stepsContainer(steps) {
    return (
        <Row>
            <Col xs={12}>{steps}</Col>
        </Row>
    );
}

function step(step, index, current, setStepActiveStatus, isStepActive, getStepState) {
    return (
        <div key={index} style={{display: index === current ? 'block' : 'none'}}>
            <step.component
                {...step.initialProps}
                key={index} index={index} 
                valid={step.valid}
                submitted={step.submitted}
                stepState={step.state}
                isStepActive={isStepActive}
                setStepActiveStatus={setStepActiveStatus}
                getStepState={getStepState}
                errors={step.errors}
            />
        </div>
    );
}

function nav(
    first,
    last,
    valid,
    prev,
    next,
    finish,
    {
        disableOnInvalid,
        labels,
    }) {
    return (
        <fieldset>
            <legend></legend>
            <Row className="text-center">
                <Button
                    style={{display: first ? 'none' : 'inline-block',}}
                    onClick={prev}
                >
                    <Glyphicon glyph="chevron-left" /> {labels.prev}
                </Button>
                {' '}
                <Button
                    disabled={!valid && disableOnInvalid}
                    bsStyle="primary"
                    style={{display: last ? 'none' : 'inline-block',}}
                    onClick={next}
                >
                    {labels.next} <Glyphicon glyph="chevron-right" />
                </Button> 
                {' '}
                <Button 
                    disabled={!valid && disableOnInvalid} bsStyle="primary"
                    style={{ display: last ? 'inline-block' : 'none', }}
                    onClick={finish}
                >
                    {labels.finish} <Glyphicon glyph="ok" />
                </Button> 
            </Row>
            <br/>
        </fieldset>
    );
}
