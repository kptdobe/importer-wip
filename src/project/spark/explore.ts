/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable no-console */


import FSHandler from '../../product/storage/FSHandler';

import CSV from '../../product/utils/CSV';
import { WPContentPager } from '../../product/wp/explorers/WPContentPager';


async function main() {
  const handler = new FSHandler('output/spark', console);
  const pager = new WPContentPager({
    nbMaxPages: 1000,
    url: 'https://blog.adobespark.com/'
  });

  let csv = '';
  try {
    csv = await handler.get('explorer_result_full.csv');
  } catch(e) {
    // ignore
  }

  const entries = await pager.explore(1, async (page, index) => {
    csv += CSV.toCSV(page, ';', index === 1);
    await handler.put('explorer_result_full.csv', csv);
  });
  // tslint:disable-next-line: no-console
  console.log(`Received ${entries.length} entries!`);
}

main();