import { Tabs, Tab } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import cx from "classnames";
import Mousetrap from "mousetrap";

import * as GQL from "src/core/generated-graphql";
import {
  useFindTag,
  useTagUpdate,
  useTagCreate,
  useTagDestroy,
  mutateMetadataAutoTag,
} from "src/core/StashService";
import { ImageUtils } from "src/utils";
import {
  DetailsEditNavbar,
  Modal,
  LoadingIndicator,
} from "src/components/Shared";
import { useToast } from "src/hooks";
import { TagScenesPanel } from "./TagScenesPanel";
import { TagMarkersPanel } from "./TagMarkersPanel";
import { TagImagesPanel } from "./TagImagesPanel";
import { TagPerformersPanel } from "./TagPerformersPanel";
import { TagGalleriesPanel } from "./TagGalleriesPanel";
import { TagDetailsPanel } from "./TagDetailsPanel";
import { TagEditPanel } from "./TagEditPanel";

interface ITabParams {
  id?: string;
  tab?: string;
}

export const Tag: React.FC = () => {
  const history = useHistory();
  const Toast = useToast();
  const { tab = "scenes", id = "new" } = useParams<ITabParams>();
  const isNew = id === "new";

  // Editing state
  const [isEditing, setIsEditing] = useState<boolean>(isNew);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);

  // Editing tag state
  const [image, setImage] = useState<string | null>();

  // Tag state
  const { data, error, loading } = useFindTag(id);
  const tag = data?.findTag;

  const [updateTag] = useTagUpdate();
  const [createTag] = useTagCreate();
  const [deleteTag] = useTagDestroy({ id });

  const activeTabKey =
    tab === "markers" ||
    tab === "images" ||
    tab === "performers" ||
    tab === "galleries"
      ? tab
      : "scenes";
  const setActiveTabKey = (newTab: string | null) => {
    if (tab !== newTab) {
      const tabParam = newTab === "scenes" ? "" : `/${newTab}`;
      history.replace(`/tags/${id}${tabParam}`);
    }
  };

  // set up hotkeys
  useEffect(() => {
    Mousetrap.bind("e", () => setIsEditing(true));
    Mousetrap.bind("d d", () => onDelete());

    return () => {
      if (isEditing) {
        Mousetrap.unbind("s s");
      }

      Mousetrap.unbind("e");
      Mousetrap.unbind("d d");
    };
  });

  useEffect(() => {
    if (data && data.findTag) {
      setImage(undefined);
    }
  }, [data]);

  function onImageLoad(imageData: string) {
    setImage(imageData);
  }

  const imageEncoding = ImageUtils.usePasteImage(onImageLoad, isEditing);

  if (!isNew && !isEditing) {
    if (!data?.findTag || loading) return <LoadingIndicator />;
    if (error) return <div>{error.message}</div>;
  }

  function getTagInput(
    input: Partial<GQL.TagCreateInput | GQL.TagUpdateInput>
  ) {
    const ret: Partial<GQL.TagCreateInput | GQL.TagUpdateInput> = {
      ...input,
      image,
    };

    if (!isNew) {
      (ret as GQL.TagUpdateInput).id = id;
    }

    return ret;
  }

  async function onSave(
    input: Partial<GQL.TagCreateInput | GQL.TagUpdateInput>
  ) {
    try {
      if (!isNew) {
        const result = await updateTag({
          variables: {
            input: getTagInput(input) as GQL.TagUpdateInput,
          },
        });
        if (result.data?.tagUpdate) {
          setIsEditing(false);
          return result.data.tagUpdate.id;
        }
      } else {
        const result = await createTag({
          variables: {
            input: getTagInput(input) as GQL.TagCreateInput,
          },
        });
        if (result.data?.tagCreate?.id) {
          setIsEditing(false);
          return result.data.tagCreate.id;
        }
      }
    } catch (e) {
      Toast.error(e);
    }
  }

  async function onAutoTag() {
    if (!tag?.id) return;
    try {
      await mutateMetadataAutoTag({ tags: [tag.id] });
      Toast.success({ content: "Started auto tagging" });
    } catch (e) {
      Toast.error(e);
    }
  }

  async function onDelete() {
    try {
      await deleteTag();
    } catch (e) {
      Toast.error(e);
    }

    // redirect to tags page
    history.push(`/tags`);
  }

  function renderDeleteAlert() {
    return (
      <Modal
        show={isDeleteAlertOpen}
        icon="trash-alt"
        accept={{ text: "Delete", variant: "danger", onClick: onDelete }}
        cancel={{ onClick: () => setIsDeleteAlertOpen(false) }}
      >
        <p>Are you sure you want to delete {tag?.name ?? "tag"}?</p>
      </Modal>
    );
  }

  function onToggleEdit() {
    setIsEditing(!isEditing);
    setImage(undefined);
  }

  function renderImage() {
    let tagImage = tag?.image_path;
    if (isEditing) {
      if (image === null) {
        tagImage = `${tagImage}&default=true`;
      } else if (image) {
        tagImage = image;
      }
    }

    if (tagImage) {
      return <img className="logo" alt={tag?.name ?? ""} src={tagImage} />;
    }
  }

  return (
    <div className="row">
      <div
        className={cx("tag-details", {
          "col-md-4": !isNew,
          "col-8": isNew,
        })}
      >
        <div className="text-center logo-container">
          {imageEncoding ? (
            <LoadingIndicator message="Encoding image..." />
          ) : (
            renderImage()
          )}
          {!isNew && tag && <h2>{tag.name}</h2>}
        </div>
        {!isEditing && !isNew && tag ? (
          <>
            <TagDetailsPanel tag={tag} />
            {/* HACK - this is also rendered in the TagEditPanel */}
            <DetailsEditNavbar
              objectName={tag.name ?? "tag"}
              isNew={isNew}
              isEditing={isEditing}
              onToggleEdit={onToggleEdit}
              onSave={() => {}}
              onImageChange={() => {}}
              onClearImage={() => {}}
              onAutoTag={onAutoTag}
              onDelete={onDelete}
            />
          </>
        ) : (
          <TagEditPanel
            tag={tag ?? undefined}
            onSubmit={onSave}
            onCancel={onToggleEdit}
            onDelete={onDelete}
            setImage={setImage}
          />
        )}
      </div>
      {!isNew && tag && (
        <div className="col col-md-8">
          <Tabs
            id="tag-tabs"
            mountOnEnter
            activeKey={activeTabKey}
            onSelect={setActiveTabKey}
          >
            <Tab eventKey="scenes" title="Scenes">
              <TagScenesPanel tag={tag} />
            </Tab>
            <Tab eventKey="images" title="Images">
              <TagImagesPanel tag={tag} />
            </Tab>
            <Tab eventKey="galleries" title="Galleries">
              <TagGalleriesPanel tag={tag} />
            </Tab>
            <Tab eventKey="markers" title="Markers">
              <TagMarkersPanel tag={tag} />
            </Tab>
            <Tab eventKey="performers" title="Performers">
              <TagPerformersPanel tag={tag} />
            </Tab>
          </Tabs>
        </div>
      )}
      {renderDeleteAlert()}
    </div>
  );
};
