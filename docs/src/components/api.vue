<script setup lang="ts">
import type { Spec } from 'comment-parser';
import { isDefaultType } from '../utils/isDefaultType';

const props = defineProps<{
  apiParameters: Spec[];
}>();

type Group = {
  id: number;
  parameters: Spec[];
  return: Spec | null;
};

let groupIndex = 0;
const groups: Group[] = [{ id: groupIndex, parameters: [], return: null }];

props.apiParameters.forEach((parameter, index) => {
  if (parameter.tag === 'overload') {
    const isFirstOverload =
      props.apiParameters.findIndex((parameter) => parameter.tag === 'overload') === index;
    if (!isFirstOverload) {
      groupIndex++;
      groups.push({ id: groupIndex, parameters: [], return: null });
    }
    return;
  }

  if (parameter.tag === 'return') {
    groups[groupIndex].return = parameter;
    return;
  }

  groups[groupIndex].parameters.push(parameter);
});
</script>

<template>
  <h3>Parameters</h3>
  <div v-for="group in groups" :key="group.id">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="parameter in group.parameters" :key="parameter.name">
          <td>{{ parameter.name }}{{ parameter.optional ? '?' : '' }}</td>

          <td v-if="isDefaultType(parameter.type)">
            {{ parameter.type }}
          </td>
          <td v-else>
            <a href="#">{{ parameter.type }}</a>
          </td>

          <td>
            {{ parameter.default ?? '-' }}
          </td>
          <td>{{ parameter.description }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="group.return">
      <h3>Returns</h3>
      <p>
        <a href="#">
          <code>{{ group.return.type }}</code>
        </a>
      </p>
    </div>
  </div>
</template>
