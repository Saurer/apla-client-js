/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { LocalizedRequest } from '../../types/locale';
import { Section, SectionStatus } from '../../types/section';

type Request = LocalizedRequest;

type Response = {
    mainIndex: number;
    values: Section[];
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'sections',
    provideParams: request => ({
        lang: request.locale,
        offset: 0,
        limit: 10
    }),
    responseTransformer: (response: { list: any[] }) => ({
        mainIndex: response.list.findIndex(
            section => section.status === SectionStatus.Main
        ),
        values: response.list.map(s => ({
            id: s.id,
            status: s.status,
            defaultPage: s.page,
            title: s.title,
            route: s.urlname
        }))
    })
});
