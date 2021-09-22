import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TagService } from '../tag/tag.service';
import { TagDto } from '../tag/dto/tag.dto';

@Injectable()
export class AdService {
  logger = new Logger(AdService.name);

  /*
  * TODO:
  * This parameter shouldn't be a stateful item inside the service, it should go to the shared storage (Infinispan/Redis),
  * in order to be able to re-use between several instances of the application and scale it horizontally
  * But it is only for exercise purpose.
  * */
  adsShownIds: number[] = [];

  constructor(
    @Inject(TagService)
    private readonly tagService: TagService,
  ) {}

  private async selectAdBySupplyId(supplyId: number): Promise<TagDto> {
    const count = await this.tagService.getCountBySupplyId(supplyId);
    this.logger.debug(`COUNT: ${count}`);
    if (count === this.adsShownIds.length) {
      this.adsShownIds = [];
    }

    if (count === 0) {
      throw new NotFoundException(`Ads with supplyId ${supplyId} not found!`);
    }

    const tags = await this.tagService.getTagsBySupplyIdExcluded(supplyId, this.adsShownIds);
    const picked = tags[0];

    this.adsShownIds.push(picked.id);

    return picked;
  }

  public async getByParams(supplyId: number) {
    const tag = await this.selectAdBySupplyId(supplyId);

    return `
<?xml version="1.0" encoding="utf-8"?>
<VAST version="2.0">
	<Ad id="${tag.id}">
		<InLine>
			<AdTitle>Tag</AdTitle>
			<Creatives>
				<Creative sequence="1">
					<Linear>
						<MediaFiles>
							<MediaFile delivery="progressive" bitrate="256" width="480" height="352" type="video/mp4">${tag.tagUrl}</MediaFile>
						</MediaFiles>
					</Linear>
				</Creative>
			</Creatives>
		</InLine>
	</Ad>
</VAST>
`;
  }
}
