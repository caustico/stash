import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import cx from "classnames";
import * as GQL from "src/core/generated-graphql";
import { Icon, TagLink, HoverPopover, SweatDrops } from "src/components/Shared";
import { TextUtils } from "src/utils";
import { PerformerPopoverButton } from "../Shared/PerformerPopoverButton";
import { GridCard } from "../Shared/GridCard";

interface IImageCardProps {
  image: GQL.SlimImageDataFragment;
  selecting?: boolean;
  selected: boolean | undefined;
  zoomIndex: number;
  onSelectedChanged: (selected: boolean, shiftKey: boolean) => void;
}

export const ImageCard: React.FC<IImageCardProps> = (
  props: IImageCardProps
) => {
  function maybeRenderRatingBanner() {
    if (!props.image.rating) {
      return;
    }
    return (
      <div
        className={`rating-banner ${
          props.image.rating ? `rating-${props.image.rating}` : ""
        }`}
      >
        RATING: {props.image.rating}
      </div>
    );
  }

  function maybeRenderTagPopoverButton() {
    if (props.image.tags.length <= 0) return;

    const popoverContent = props.image.tags.map((tag) => (
      <TagLink key={tag.id} tag={tag} tagType="image" />
    ));

    return (
      <HoverPopover placement="bottom" content={popoverContent}>
        <Button className="minimal">
          <Icon icon="tag" />
          <span>{props.image.tags.length}</span>
        </Button>
      </HoverPopover>
    );
  }

  function maybeRenderPerformerPopoverButton() {
    if (props.image.performers.length <= 0) return;

    return <PerformerPopoverButton performers={props.image.performers} />;
  }

  function maybeRenderOCounter() {
    if (props.image.o_counter) {
      return (
        <div>
          <Button className="minimal">
            <span className="fa-icon">
              <SweatDrops />
            </span>
            <span>{props.image.o_counter}</span>
          </Button>
        </div>
      );
    }
  }

  function maybeRenderOrganized() {
    if (props.image.organized) {
      return (
        <div>
          <Button className="minimal">
            <Icon icon="box" />
          </Button>
        </div>
      );
    }
  }

  function maybeRenderPopoverButtonGroup() {
    if (
      props.image.tags.length > 0 ||
      props.image.performers.length > 0 ||
      props.image.o_counter ||
      props.image.organized
    ) {
      return (
        <>
          <hr />
          <ButtonGroup className="card-popovers">
            {maybeRenderTagPopoverButton()}
            {maybeRenderPerformerPopoverButton()}
            {maybeRenderOCounter()}
            {maybeRenderOrganized()}
          </ButtonGroup>
        </>
      );
    }
  }

  function isPortrait() {
    const { file } = props.image;
    const width = file.width ? file.width : 0;
    const height = file.height ? file.height : 0;
    return height > width;
  }

  return (
    <GridCard
      className={`image-card zoom-${props.zoomIndex}`}
      url={`/images/${props.image.id}`}
      title={
        props.image.title
          ? props.image.title
          : TextUtils.fileNameFromPath(props.image.path)
      }
      linkClassName="image-card-link"
      image={
        <>
          <div className={cx("image-card-preview", { portrait: isPortrait() })}>
            <img
              className="image-card-preview-image"
              alt={props.image.title ?? ""}
              src={props.image.paths.thumbnail ?? ""}
            />
          </div>
          {maybeRenderRatingBanner()}
        </>
      }
      popovers={maybeRenderPopoverButtonGroup()}
      selected={props.selected}
      selecting={props.selecting}
      onSelectedChanged={props.onSelectedChanged}
    />
  );
};
