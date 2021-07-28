/* eslint new-cap: 0 */

import React from 'react';
import { Switch, Redirect } from 'react-router';
import { Route } from 'react-router-dom';

/* containers */
import { App } from './containers/App/index.js';
import { HomeContainer } from './containers/HomeContainer/index.js';
import { TutorialDoneContainer } from './containers/TutorialDoneContainer/index.js';

/* components */
import AnnotationView from './components/Annotation/AnnotationView.js';
import FilesViewer from './components/Files/FilesViewer.js';
import NotFound from './components/NotFound.js';
import TutorialView from './components/Tutorial/TutorialView.js';
import TutorialAnnotation from './components/Tutorial/TutorialAnnotation.js';
import TutorialExplanation from './components/Tutorial/TutorialExplanation.js';

export default (
    <Route path="/">
        <App>
            <Switch>
                <Route exact path="/" component={HomeContainer} />
                <Route path="/filesView" component={FilesViewer} />
                <Route path="/annotation/:fileId" component={AnnotationView} />
                <Route path="/annotation" component={AnnotationView} />
                <Route path="/tutorial/done" component={TutorialDoneContainer} />
                <Route path="/tutorial/:userId/:fileId" component={TutorialAnnotation} />
                <Route path="/tutorial/explanation/:userId/:fileId" component={TutorialExplanation} />
                <Route path="/tutorial" component={TutorialView} />
                <Route component={NotFound} />
            </Switch>
        </App>
    </Route>
);
