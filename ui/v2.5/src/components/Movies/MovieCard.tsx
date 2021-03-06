import React, { FunctionComponent } from "react";
import { FormattedPlural } from "react-intl";
import * as GQL from "src/core/generated-graphql";
import { GridCard } from "src/components/Shared";

interface IProps {
  movie: GQL.MovieDataFragment;
  sceneIndex?: number;
  selecting?: boolean;
  selected?: boolean;
  onSelectedChanged?: (selected: boolean, shiftKey: boolean) => void;
}

export const MovieCard: FunctionComponent<IProps> = (props: IProps) => {
  function maybeRenderRatingBanner() {
    if (!props.movie.rating) {
      return;
    }
    return (
      <div
        className={`rating-banner ${
          props.movie.rating ? `rating-${props.movie.rating}` : ""
        }`}
      >
        RATING: {props.movie.rating}
      </div>
    );
  }

  function maybeRenderSceneNumber() {
    if (!props.sceneIndex) {
      return (
        <span>
          {props.movie.scene_count}&nbsp;
          <FormattedPlural
            value={props.movie.scene_count ?? 0}
            one="scene"
            other="scenes"
          />
        </span>
      );
    }

    return <span>Scene number: {props.sceneIndex}</span>;
  }

  return (
    <GridCard
      className="movie-card"
      url={`/movies/${props.movie.id}`}
      title={props.movie.name}
      linkClassName="movie-card-header"
      image={
        <>
          <img
            className="movie-card-image"
            alt={props.movie.name ?? ""}
            src={props.movie.front_image_path ?? ""}
          />
          {maybeRenderRatingBanner()}
        </>
      }
      details={maybeRenderSceneNumber()}
      selected={props.selected}
      selecting={props.selecting}
      onSelectedChanged={props.onSelectedChanged}
    />
  );
};
