/* eslint-disable consistent-return, default-case */
import {
  StringCriterion,
  NumberCriterion,
  DurationCriterion,
  MandatoryStringCriterion,
  MandatoryNumberCriterion,
  CriterionOption,
} from "./criterion";
import { OrganizedCriterion } from "./organized";
import { FavoriteCriterion } from "./favorite";
import { HasMarkersCriterion } from "./has-markers";
import {
  PerformerIsMissingCriterion,
  SceneIsMissingCriterion,
  GalleryIsMissingCriterion,
  TagIsMissingCriterion,
  StudioIsMissingCriterion,
  MovieIsMissingCriterion,
  ImageIsMissingCriterion,
} from "./is-missing";
import { NoneCriterion } from "./none";
import { PerformersCriterion } from "./performers";
import { RatingCriterion } from "./rating";
import { AverageResolutionCriterion, ResolutionCriterion } from "./resolution";
import { StudiosCriterion, ParentStudiosCriterion } from "./studios";
import {
  PerformerTagsCriterionOption,
  SceneTagsCriterionOption,
  TagsCriterion,
  TagsCriterionOption,
} from "./tags";
import { GenderCriterion } from "./gender";
import { MoviesCriterion } from "./movies";
import { GalleriesCriterion } from "./galleries";
import { CriterionType } from "../types";
import { InteractiveCriterion } from "./interactive";

export function makeCriteria(type: CriterionType = "none") {
  switch (type) {
    case "none":
      return new NoneCriterion();
    case "path":
      return new MandatoryStringCriterion(new CriterionOption(type, type));
    case "rating":
      return new RatingCriterion();
    case "organized":
      return new OrganizedCriterion();
    case "o_counter":
    case "scene_count":
    case "marker_count":
    case "image_count":
    case "gallery_count":
    case "performer_count":
    case "tag_count":
      return new MandatoryNumberCriterion(new CriterionOption(type, type));
    case "resolution":
      return new ResolutionCriterion();
    case "average_resolution":
      return new AverageResolutionCriterion();
    case "duration":
      return new DurationCriterion(new CriterionOption(type, type));
    case "favorite":
      return new FavoriteCriterion();
    case "hasMarkers":
      return new HasMarkersCriterion();
    case "sceneIsMissing":
      return new SceneIsMissingCriterion();
    case "imageIsMissing":
      return new ImageIsMissingCriterion();
    case "performerIsMissing":
      return new PerformerIsMissingCriterion();
    case "galleryIsMissing":
      return new GalleryIsMissingCriterion();
    case "tagIsMissing":
      return new TagIsMissingCriterion();
    case "studioIsMissing":
      return new StudioIsMissingCriterion();
    case "movieIsMissing":
      return new MovieIsMissingCriterion();
    case "tags":
      return new TagsCriterion(TagsCriterionOption);
    case "sceneTags":
      return new TagsCriterion(SceneTagsCriterionOption);
    case "performerTags":
      return new TagsCriterion(PerformerTagsCriterionOption);
    case "performers":
      return new PerformersCriterion();
    case "studios":
      return new StudiosCriterion();
    case "parent_studios":
      return new ParentStudiosCriterion();
    case "movies":
      return new MoviesCriterion();
    case "galleries":
      return new GalleriesCriterion();
    case "birth_year":
    case "death_year":
    case "weight":
      return new NumberCriterion(new CriterionOption(type, type));
    case "age":
      return new MandatoryNumberCriterion(new CriterionOption(type, type));
    case "gender":
      return new GenderCriterion();
    case "ethnicity":
    case "country":
    case "hair_color":
    case "eye_color":
    case "height":
    case "measurements":
    case "fake_tits":
    case "career_length":
    case "tattoos":
    case "piercings":
    case "aliases":
    case "url":
    case "stash_id":
      return new StringCriterion(new CriterionOption(type, type));
    case "interactive":
      return new InteractiveCriterion();
  }
}
