import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import fs from 'fs';
import path from 'path';
import txtToJson from '@/utils/txtToJson';
import Table from '@/components/Table';
import convertFiles from '@/utils/convertFiles';
import mergeData from '@/utils/mergeData';
import cleanData from '@/utils/cleanData';
import formatData from '@/utils/formatData';
import { format, parse } from 'date-fns';
import filterObject from '@/utils/filterObject';

export default function Home() {
  return (
    <div className="bg-gray-50">
      <div className="pb-32 bg-gray-900">
        <header className="py-10">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">
              Consumer Price Index (CPI) Data
            </h1>
            <p className="text-gray-400">Last updated: August 7, 2021</p>
          </div>
        </header>
      </div>
      <main className="-mt-32">
        <div className="px-4 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Chart go here */}
          <div className="px-5 py-6 bg-white rounded-lg shadow sm:px-6">
            <div className="border-4 border-gray-200 border-dashed rounded-lg h-96" />
          </div>
          {/* Chart go here */}
          <div className="my-20 prose prose-lg">
            <p>
              The Consumer Price Index (CPI) is a statistical measure of change,
              over time, of the prices of goods and services in major
              expenditure groups–such as food, housing, apparel, transportation,
              and medical care–typically purchased by urban consumers.
              Essentially, it compares the cost of a sample "market basket" of
              goods and services in a specific month relative to the cost of the
              same "market basket" in an earlier reference period. This
              reference period is designated as the base period.
            </p>
          </div>
          <div className="space-y-10">
            <Table
              headers={[
                {
                  header: 'File',
                  accessor: 'file'
                },
                {
                  header: 'Description',
                  accessor: 'desc'
                }
              ]}
              data={generalInformation.mapping}
            />

            <Table
              headers={[
                {
                  header: 'File',
                  accessor: 'file'
                },
                {
                  header: 'Description',
                  accessor: 'desc'
                },
                {
                  header: 'Size (MB)',
                  accessor: 'size'
                }
              ]}
              data={generalInformation.data}
              cellFormat={{
                size: (value: number) => (
                  <pre>{(value / 1000000).toFixed(2)}</pre>
                )
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context: GetStaticProps) {
  const testData = {
    hello: 'hello!'
  };

  // If data pull hasn’t happened in 2 months, pull new data :grimace:
  // https://download.bls.gov/pub/time.series/cu/cu.txt
  // https://download.bls.gov/pub/time.series/cu/
  // https://download.bls.gov/pub/time.series/cu/cu.period
  // https://download.bls.gov/pub/time.series/cu/cu.data.0.Current

  convertFiles([
    { inputName: 'cu.data.2.Summaries.txt', outputName: 'summaries-converted' },
    { inputName: 'cu.period.txt', outputName: 'period' },
    { inputName: 'cu.series.txt', outputName: 'series-converted' },
    { inputName: 'cu.item.txt', outputName: 'item-converted' }
  ]);

  // Filters out everything but monthly values, filters out annual summary values
  // M01-12=Monthly
  // M13=Annual	Avg
  // S01-03=Semi-Annually
  filterObject({
    inputFile: 'summaries-converted.json',
    outputFile: 'summaries.json',
    filterFunction: (value: any) =>
      value.period !== 'M13' && value.period?.charAt(0) !== 'S'
  });

  filterObject({
    inputFile: 'summaries.json',
    outputFile: 'summaries.json',
    filterFunction: (value: any) => value.series_id !== 0
  });

  // Filters for US wide and seasonally adjusted data
  filterObject({
    inputFile: 'series-converted.json',
    outputFile: 'series.json',
    filterFunction: (value: any) => {
      return (
        // (value.area_code == '0000' || value.area_code == 0) &&
        value.seasonal == 'S'
      );
    }
  });

  [
    {
      inputFile: 'item-converted.json',
      outputFile: 'item.json',
      fields: ['item_code', 'item_name']
    },
    {
      inputFile: 'summaries.json',
      outputFile: 'summaries.json',
      fields: ['series_id', 'year', 'period', 'value']
    },
    {
      inputFile: 'series.json',
      outputFile: 'series.json',
      fields: ['series_id', 'item_code', 'series_title', 'seasonal']
    }
  ].forEach((dataToClean) => cleanData(dataToClean));

  mergeData({
    outputFile: 'merged-data.json',
    initialFile: 'summaries.json',
    joinFile: [
      { source: 'series.json', joinProp: 'series_id' },
      { source: 'period.json', joinProp: 'period' }
    ]
  });

  filterObject({
    inputFile: 'merged-data.json',
    outputFile: 'merged-data.json',
    filterFunction: (value: any) => value.series_title
  });

  formatData({
    inputFile: 'merged-data.json',
    outputFile: 'merged-data.json',
    fields: ['series_id', 'value', 'series_title', 'seasonal'],
    format: {
      date: (value: any) => {
        // try {
        //   format(
        //     parse(
        //       `${value['year']}-${value['period_name']}-01`,
        //       'yyyy-MMMM-dd',
        //       new Date()
        //     ),
        //     'yyyy-MM-dd'
        //   );
        // } catch (err) {
        //   console.log('SHIT');
        //   console.log(value);
        //   console.log('SHIT');
        // }

        return (
          value['period_name'] &&
          value['year'] &&
          format(
            parse(
              `${value['year']}-${value['period_name']}-01`,
              'yyyy-MMMM-dd',
              new Date()
            ),
            'yyyy-MM-dd'
          )
        );
      }
    }
  });

  // ----

  // const chartData = {
  //   outputFile: 'chartData.json',
  //   fields: []
  // };

  return {
    props: {} // will be passed to the page component as props
  };
}

// cu.data.2.Summaries                        10.5MB    Summaries (item_code SA0, SAF, SAH, SAA, SAT, SAM, SAR, SAE, SAG, SAS, SAC)

// cu.data.11.USFoodBeverage                  5.8MB      All US Food and Beverage (area_code 0000, item_code SAF, SEF)
// cu.data.12.USHousing                       2.3MB      All US Housing (area_code 0000, item_code SAH, SEH)
// cu.data.13.USApparel                       1.2MB      All US Apparel (area_code 0000, item_code SAA, SEA)
// cu.data.14.USTransportation                1.9MB      All US Transportation (area_code 0000, item_code SAT, SET)
// cu.data.15.USMedical                       0.8MB      All US Medical (area_code 0000, item_code SAM, SEM, SS57)
// cu.data.16.USRecreation                    1.2MB      All US Recreation (area_code 0000, item_code SAR, SER, SS31, SS61, SS62)
// cu.data.17.USEducationAndCommunication     0.7MB      All US Education and Communication (area_code 0000, item_code SAE, SEE, SS27)
// cu.data.18.USOtherGoodsAndServices         0.6MB      All US Other Goods and Services (area_code 0000, item_code SAG, SEG; SS33)
// cu.data.19.PopulationSize                  1.4MB      All Population-size (area_code A000, X000, D000)
// cu.data.20.USCommoditiesServicesSpecial    3.2MB      All US Commodity and Services and Special(area_code 0000, item_code SA0, SAC, SAN, SAS)

//  cu.area             Area codes		            mapping file
// 	cu.footnote         Footnote codes            mapping file
// 	cu.item             Item codes                mapping file
// 	cu.MapErrors (TBR)  Map error codes           mapping file
// 	cu.period           Period codes              mapping file
// 	cu.series           All series and their beginning and end dates
// 	cu.txt              General information

const generalInformation = {
  mapping: [
    { file: 'cu.area', desc: 'Area codes' },
    { file: 'cu.footnote', desc: 'Footnote codes' },
    { file: 'cu.item', desc: 'Item codes' },
    { file: 'cu.period', desc: 'Period codes' },
    { file: 'cu.series', desc: 'All series and their beginning and end dates' }
  ],
  data: [
    {
      file: 'cu.data.2.Summaries',
      desc: 'Summaries (item_code SA0, SAF, SAH, SAA, SAT, SAM, SAR, SAE, SAG, SAS, SAC)',
      size: 10522193
    },
    {
      file: 'cu.data.11.USFoodBeverage',
      desc: 'All US Food and Beverage (area_code 0000, item_code SAF, SEF)',
      size: 5809667
    },
    {
      file: 'cu.data.12.USHousing',
      desc: 'All US Housing (area_code 0000, item_code SAH, SEH)',
      size: 2335469
    },
    {
      file: 'cu.data.13.USApparel',
      desc: 'All US Apparel (area_code 0000, item_code SAA, SEA)',
      size: 1251995
    },
    {
      file: 'cu.data.14.USTransportation',
      desc: 'All US Transportation (area_code 0000, item_code SAT, SET)',
      size: 1963559
    },
    {
      file: 'cu.data.15.USMedical',
      desc: 'All US Medical (area_code 0000, item_code SAM, SEM, SS57)',
      size: 875381
    },
    {
      file: 'cu.data.16.USRecreation',
      desc: 'All US Recreation (area_code 0000, item_code SAR, SER, SS31, SS61, SS62)',
      size: 1194329
    },
    {
      file: 'cu.data.17.USEducationAndCommunication',
      desc: 'All US Education and Communication (area_code 0000, item_code SAE, SEE, SS27)',
      size: 735647
    },
    {
      file: 'cu.data.18.USOtherGoodsAndServices',
      desc: 'All US Other Goods and Services (area_code 0000, item_code SAG, SEG; SS33)',
      size: 648539
    },
    {
      file: 'cu.data.19.PopulationSize',
      desc: 'All Population-size (area_code A000, X000, D000)',
      size: 1487405
    },
    {
      file: 'cu.data.20.USCommoditiesServicesSpecial',
      desc: 'All US Commodity and Services and Special(area_code 0000, item_code SA0, SAC, SAN, SAS)',
      size: 3259343
    }
  ]
} as {
  mapping: { file: string; desc: string }[];
  data: { file: string; desc: string; size: number }[];
};
