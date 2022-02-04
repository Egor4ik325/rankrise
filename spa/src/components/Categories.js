import { useEffect, useState } from "react";
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
} from "react-complex-tree";
import "react-complex-tree/lib/style.css";
import api from "../client";

const Categories = () => {
  const [items, setItems] = useState(null);

  const fetchCategories = async () => {
    try {
      const categories = await api.categories.list();

      setItems(
        categories.results.reduce(
          (prev, category) => ({
            ...prev,
            [category.id]: {
              index: category.id,
              data: category.name,
              // Children
              hasChildren: true,
              children: [],
              // Properties
              canMove: false,
              canRename: false,
            },
          }),
          {
            root: {
              index: "root",
              hasChildren: true,
              children: categories.results.map((category) => category.id),
              // Properties
              canMove: false,
              canRename: false,
            },
          }
        )
      );
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFocusItem = (item, treeId) => {
    console.log(item);
  };

  const handleExpandItem = async (item) => {
    console.log("Expand: ", item);

    // Load children
    try {
      const children = await api.categories.list({ parent: item.index });

      setItems(
        children.results.reduce(
          (previous, child) => ({
            ...previous,
            [child.id]: {
              index: child.id,
              data: child.name,
              // Child nodes
              hasChildren: true,
              children: [],
              // Properties
              canMove: false,
              canRename: false,
            },
          }),
          {
            ...items,
            root: {
              ...items?.root,
              children: items.root.children.concat(
                children.results.map((child) => child.id)
              ),
            },
          }
        )
      );
    } catch (error) {
      throw error;
    }
  };

  const render = () => {
    if (items === null) {
      return <div>Loading...</div>;
    }

    console.log(items);

    // const items = {
    //   root: {
    //     index: "root",
    //     canMove: true,
    //     hasChildren: true,
    //     children: ["child1", "child2"],
    //     data: "Root item",
    //     canRename: true,
    //   },
    //   child1: {
    //     index: "child1",
    //     canMove: true,
    //     hasChildren: false,
    //     children: [],
    //     data: "Child item 1",
    //     canRename: true,
    //   },
    //   child2: {
    //     index: "child2",
    //     canMove: true,
    //     hasChildren: false,
    //     children: [],
    //     data: "Child item 2",
    //     canRename: true,
    //   },
    // };

    const dataProvider = new StaticTreeDataProvider(items, (item, data) => ({
      ...item,
      data,
    }));

    return (
      <div>
        <UncontrolledTreeEnvironment
          dataProvider={dataProvider}
          getItemTitle={(item) => item.data}
          viewState={{}}
          onFocusItem={handleFocusItem}
          onExpandItem={handleExpandItem}
          // Settings
          canDragAndDrop={false}
          canDropOnItemWithChildren={false}
          canReorderItems={false}
          canSearch={false}
          canSearchByStartingTyping={false}
          canRename={false}
        >
          <Tree
            treeId="categories-tree"
            rootItem="root"
            treeLabel="Categories Tree"
          />
        </UncontrolledTreeEnvironment>
      </div>
    );
  };

  return render();
};

export default Categories;
