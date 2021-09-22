import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const clearDb = async () => {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    await connection.query(
      `TRUNCATE ${entities
        .map((entity) => `"${entity.tableName}"`)
        .join(',')} CASCADE;`,
    );
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await clearDb();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should create tags and return correct ad', async () => {
    await request(app.getHttpServer())
      .post('/tags')
      .send({
        name: 'Tag 1',
        tagUrl: 'Url 1',
        deal: {
          name: 'Deal 1',
        },
        supply: {
          name: 'Supply 1',
        },
      })
      .expect(201);

    const supply1 = await request(app.getHttpServer())
      .get('/supply')
      .expect(200);

    // Make sure supply is created
    expect(supply1.body.length).toEqual(1);

    await request(app.getHttpServer())
      .post('/tags')
      .send({
        name: 'Tag 2',
        tagUrl: 'Url 2',
        deal: {
          name: 'Deal 2',
        },
        supply: {
          id: supply1.body[0].id,
        },
      })
      .expect(201);

    const supply2 = await request(app.getHttpServer())
      .get('/supply')
      .expect(200);

    // Make sure supply is the same for 2nd tag
    expect(supply2.body.length).toEqual(1);

    const deals = await request(app.getHttpServer()).get('/deals').expect(200);

    // Make sure 2 deals have been created
    expect(deals.body.length).toEqual(2);

    const tags = await request(app.getHttpServer()).get('/tags').expect(200);

    // Make sure 2 tags have been created
    expect(tags.body.length).toEqual(2);

    const ad1 = await request(app.getHttpServer())
      .get(`/ad?supplyId=${supply2.body[0].id}`)
      .expect(200);

    // Make sure we get the 1st ad by supplyId
    expect(ad1.text).toEqual(`
<?xml version="1.0" encoding="utf-8"?>
<VAST version="2.0">
	<Ad id="${tags.body[0].id}">
		<InLine>
			<AdTitle>Tag</AdTitle>
			<Creatives>
				<Creative sequence="1">
					<Linear>
						<MediaFiles>
							<MediaFile delivery="progressive" bitrate="256" width="480" height="352" type="video/mp4">${tags.body[0].tagUrl}</MediaFile>
						</MediaFiles>
					</Linear>
				</Creative>
			</Creatives>
		</InLine>
	</Ad>
</VAST>
`);

    // Make sure we get the 2n ad by supplyId
    const ad2 = await request(app.getHttpServer())
      .get(`/ad?supplyId=${supply2.body[0].id}`)
      .expect(200);

    expect(ad2.text).toEqual(`
<?xml version="1.0" encoding="utf-8"?>
<VAST version="2.0">
	<Ad id="${tags.body[1].id}">
		<InLine>
			<AdTitle>Tag</AdTitle>
			<Creatives>
				<Creative sequence="1">
					<Linear>
						<MediaFiles>
							<MediaFile delivery="progressive" bitrate="256" width="480" height="352" type="video/mp4">${tags.body[1].tagUrl}</MediaFile>
						</MediaFiles>
					</Linear>
				</Creative>
			</Creatives>
		</InLine>
	</Ad>
</VAST>
`);
  });
});
